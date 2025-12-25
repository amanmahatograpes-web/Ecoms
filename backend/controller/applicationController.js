const Application = require('../models/Application');

class ApplicationsController {
  // Get all applications with advanced filtering
  async getAllApplications(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        category,
        brand,
        subCategory,
        asin,
        registrationType,
        appeal,
        catalogueType,
        authenticationRequired,
        gtinException,
        search,
        sortBy = 'submittedAt',
        sortOrder = 'desc',
        startDate,
        endDate
      } = req.query;

      // Build query object
      const query = { isActive: true, isArchived: false };

      // Apply filters
      if (status && status !== 'all') {
        query.status = status;
      }

      if (category) {
        query.category = category;
      }

      if (brand) {
        query.brand = { $regex: brand, $options: 'i' };
      }

      if (subCategory) {
        query.subCategory = { $regex: subCategory, $options: 'i' };
      }

      if (asin) {
        query.asin = { $regex: asin, $options: 'i' };
      }

      if (registrationType) {
        query.registrationType = registrationType;
      }

      if (appeal) {
        query.appealSubmitted = appeal === 'true';
      }

      if (catalogueType) {
        query.catalogueType = catalogueType;
      }

      if (authenticationRequired) {
        query.authenticationRequired = authenticationRequired === 'true';
      }

      if (gtinException) {
        query.gtinException = gtinException;
      }

      // Date range filter
      if (startDate || endDate) {
        query.submittedAt = {};
        if (startDate) query.submittedAt.$gte = new Date(startDate);
        if (endDate) query.submittedAt.$lte = new Date(endDate);
      }

      // Search across multiple fields
      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        query.$or = [
          { productName: searchRegex },
          { sku: searchRegex },
          { asin: searchRegex },
          { brand: searchRegex },
          { category: searchRegex },
          { applicationId: searchRegex }
        ];
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        select: '-__v -isActive -isArchived',
        lean: true
      };

      const result = await Application.paginate(query, options);

      // Get statistics for the current filter
      const statsResult = await Application.getStatistics(query);
      
      // Format statistics
      const statistics = {};
      statsResult.statuses.forEach(stat => {
        statistics[stat.status] = stat.count;
      });

      res.status(200).json({
        success: true,
        message: 'Applications retrieved successfully',
        count: result.docs.length,
        total: result.totalDocs,
        pagination: {
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage
        },
        data: result.docs,
        statistics
      });

    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching applications',
        error: error.message
      });
    }
  }

  // Get application statistics
  async getApplicationStats(req, res) {
    try {
      const stats = await Application.aggregate([
        { $match: { isActive: true, isArchived: false } },
        {
          $facet: {
            statusBreakdown: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 }
                }
              }
            ],
            categoryBreakdown: [
              {
                $group: {
                  _id: '$category',
                  count: { $sum: 1 }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 10 }
            ],
            brandBreakdown: [
              {
                $group: {
                  _id: '$brand',
                  count: { $sum: 1 }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 10 }
            ],
            overall: [
              {
                $group: {
                  _id: null,
                  total: { $sum: 1 },
                  totalValue: { $sum: { $multiply: ['$price', '$quantity'] } }
                }
              }
            ]
          }
        }
      ]);

      const result = stats[0];
      const totalApplications = result.overall[0]?.total || 0;
      const approvedCount = result.statusBreakdown.find(s => s._id === 'approved')?.count || 0;
      const approvalRate = totalApplications > 0 
        ? ((approvedCount / totalApplications) * 100).toFixed(1) 
        : 0;

      res.status(200).json({
        success: true,
        data: {
          totalApplications,
          approvalRate: `${approvalRate}%`,
          totalValue: result.overall[0]?.totalValue || 0,
          statusBreakdown: result.statusBreakdown,
          categoryBreakdown: result.categoryBreakdown,
          brandBreakdown: result.brandBreakdown
        }
      });

    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching statistics',
        error: error.message
      });
    }
  }

  // Get single application by ID
  async getApplicationById(req, res) {
    try {
      const { id } = req.params;

      const application = await Application.findOne({
        $or: [
          { _id: id },
          { applicationId: id }
        ],
        isActive: true,
        isArchived: false
      }).lean();

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Application retrieved successfully',
        data: application
      });

    } catch (error) {
      console.error('Error fetching application:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching application',
        error: error.message
      });
    }
  }

  // Create new application
  async createApplication(req, res) {
    try {
      const applicationData = req.body;

      // Generate application ID if not provided
      if (!applicationData.applicationId) {
        applicationData.applicationId = `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }

      // Set default values
      applicationData.status = 'pending';
      applicationData.submittedAt = new Date();
      applicationData.isActive = true;
      applicationData.isArchived = false;

      const application = new Application(applicationData);
      await application.save();

      res.status(201).json({
        success: true,
        message: 'Application created successfully',
        data: application
      });

    } catch (error) {
      console.error('Error creating application:', error);
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Duplicate SKU or application ID',
          field: Object.keys(error.keyPattern)[0]
        });
      }
      res.status(500).json({
        success: false,
        message: 'Server error while creating application',
        error: error.message
      });
    }
  }

  // Update application status
  async updateApplicationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, feedback, reviewerNotes } = req.body;

      const application = await Application.findOne({
        $or: [
          { _id: id },
          { applicationId: id }
        ],
        isActive: true,
        isArchived: false
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      // Update application
      application.status = status;
      application.reviewedAt = new Date();
      
      if (feedback) {
        application.feedback = feedback;
      }
      
      if (reviewerNotes) {
        application.reviewerNotes = reviewerNotes;
      }

      await application.save();

      res.status(200).json({
        success: true,
        message: 'Application status updated successfully',
        data: application
      });

    } catch (error) {
      console.error('Error updating application status:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while updating application status',
        error: error.message
      });
    }
  }

  // Submit appeal for declined application
  async submitAppeal(req, res) {
    try {
      const { id } = req.params;
      const { appealReason } = req.body;

      const application = await Application.findOne({
        $or: [
          { _id: id },
          { applicationId: id }
        ],
        isActive: true,
        isArchived: false
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }

      if (application.status !== 'declined') {
        return res.status(400).json({
          success: false,
          message: 'Only declined applications can be appealed'
        });
      }

      if (application.appealSubmitted) {
        return res.status(400).json({
          success: false,
          message: 'Appeal already submitted for this application'
        });
      }

      // Update application with appeal
      application.appealSubmitted = true;
      application.appealReason = appealReason;
      application.status = 'appeal';
      application.reviewedAt = null;

      await application.save();

      res.status(200).json({
        success: true,
        message: 'Appeal submitted successfully',
        data: application
      });

    } catch (error) {
      console.error('Error submitting appeal:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while submitting appeal',
        error: error.message
      });
    }
  }

  // Export applications
  async exportApplications(req, res) {
    try {
      const { format = 'json', ...filters } = req.query;

      // Build query from filters
      const query = { isActive: true, isArchived: false };
      
      Object.keys(filters).forEach(key => {
        if (key !== 'format' && filters[key]) {
          if (key === 'search') {
            const searchRegex = { $regex: filters[key], $options: 'i' };
            query.$or = [
              { productName: searchRegex },
              { sku: searchRegex },
              { asin: searchRegex },
              { brand: searchRegex },
              { category: searchRegex },
              { applicationId: searchRegex }
            ];
          } else if (key === 'authenticationRequired' || key === 'appealSubmitted') {
            query[key] = filters[key] === 'true';
          } else {
            query[key] = filters[key];
          }
        }
      });

      const applications = await Application.find(query)
        .select('applicationId productName sku asin category brand status submittedAt reviewedAt price quantity')
        .lean();

      if (applications.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No applications found for export'
        });
      }

      let data, contentType, filename;

      if (format === 'json') {
        data = JSON.stringify(applications, null, 2);
        contentType = 'application/json';
        filename = `applications_${Date.now()}.json`;
      } else if (format === 'csv') {
        // Convert to CSV
        const headers = [
          'Application ID',
          'Product Name',
          'SKU',
          'ASIN',
          'Category',
          'Brand',
          'Status',
          'Submitted Date',
          'Reviewed Date',
          'Price',
          'Quantity'
        ].join(',');

        const rows = applications.map(app => [
          app.applicationId,
          `"${app.productName.replace(/"/g, '""')}"`,
          app.sku,
          app.asin || '',
          app.category,
          app.brand,
          app.status,
          new Date(app.submittedAt).toISOString(),
          app.reviewedAt ? new Date(app.reviewedAt).toISOString() : '',
          app.price,
          app.quantity
        ].join(','));

        data = [headers, ...rows].join('\n');
        contentType = 'text/csv';
        filename = `applications_${Date.now()}.csv`;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Unsupported export format. Use "json" or "csv"'
        });
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(data);

    } catch (error) {
      console.error('Error exporting applications:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while exporting applications',
        error: error.message
      });
    }
  }

  // Health check endpoint
  async healthCheck(req, res) {
    try {
      const dbStatus = Application.db.readyState;
      
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: dbStatus === 1 ? 'connected' : 'disconnected',
        service: 'Applications API',
        uptime: process.uptime()
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      });
    }
  }
}

module.exports = new ApplicationsController();