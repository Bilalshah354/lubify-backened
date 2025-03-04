
const Review = require('../models/Review');

exports.addReview = async (reviewData) => {
    const review = new Review(reviewData);
    await review.save();
    return 'Review added';
};

exports.getUserReviews = async (userId) => {
    const reviews = await Review.find({ userId });
    if (reviews.length === 0) throw new Error('No reviews found');

    const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRatings / reviews.length;

    return {
        reviews,
        averageRating
    };
};
