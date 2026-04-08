const Service = require('../models/service.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Create a service
// @route   POST /api/services
// @access  Private (provider only)
const createService = async (req, res) => {
    try {
        const { title, description, category, price, location } = req.body;

        if (!title || !description || !category || !price || !location) {
            return errorResponse(res, 400, 'All fields are required.');
        }

        const service = await Service.create({
            title,
            description,
            category,
            price,
            location,
            provider: req.user._id,
        });

        return successResponse(res, 201, 'Service created successfully.', { service });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Get all services with filter, search, pagination, sorting
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            location,
            keyword,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc',
        } = req.query;

        // Build filter object dynamically
        const filter = { isActive: true };

        if (category) {
            filter.category = category;
        }

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ];
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Sorting
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortObj = { [sortBy]: sortOrder };

        const total = await Service.countDocuments(filter);

        const services = await Service.find(filter)
            .populate('provider', 'name email location')
            .sort(sortObj)
            .skip(skip)
            .limit(limitNum);

        return successResponse(res, 200, 'Services fetched successfully.', {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            count: services.length,
            services,
        });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate(
            'provider',
            'name email location'
        );

        if (!service) {
            return errorResponse(res, 404, 'Service not found.');
        }

        return successResponse(res, 200, 'Service fetched successfully.', { service });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (owner only)
const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return errorResponse(res, 404, 'Service not found.');
        }

        // Only owner can update
        if (service.provider.toString() !== req.user._id.toString()) {
            return errorResponse(res, 403, 'Not authorized to update this service.');
        }

        const { title, description, category, price, location, isActive } = req.body;

        if (title) service.title = title;
        if (description) service.description = description;
        if (category) service.category = category;
        if (price) service.price = price;
        if (location) service.location = location;
        if (typeof isActive === 'boolean') service.isActive = isActive;

        const updated = await service.save();

        return successResponse(res, 200, 'Service updated successfully.', {
            service: updated,
        });
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (owner or admin)
const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return errorResponse(res, 404, 'Service not found.');
        }

        // Owner or admin can delete
        const isOwner = service.provider.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return errorResponse(res, 403, 'Not authorized to delete this service.');
        }

        await service.deleteOne();

        return successResponse(res, 200, 'Service deleted successfully.', {});
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

module.exports = {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
};