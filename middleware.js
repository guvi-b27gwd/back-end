const logging = (req, res, next) => {
  console.log(`Request Received - ${new Date()} - ${req.url} - ${req.method}`);
  next();
};

module.exports = {
  logging,
};
