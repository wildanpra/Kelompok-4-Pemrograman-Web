const errorHandler = (err, req, res, next) => {
  if (
    err &&
    typeof err.status === "function" &&
    typeof err.json === "function"
  ) {
    const response = err;
    const actualError = req;
    const statusCode = typeof res === "number" ? res : 500;
    const clientMessage =
      next ||
      (actualError && actualError.message) ||
      actualError ||
      "An error occurred";

    console.error(`[DIRECT ERROR]`, actualError);
    return response.status(statusCode).json({
      success: false,
      message: clientMessage,
    });
  }

  // Otherwise, standard Express middleware behavior
  console.error(
    `[ERROR] ${req ? req.method : ""} ${req ? req.path : ""}`,
    err ? err.message || err : "",
  );

  if (err && err.code === "ER_DUP_ENTRY") {
    return res
      .status(400)
      .json({
        success: false,
        message: "Data sudah ada, tidak boleh duplikat",
      });
  }

  res
    .status(500)
    .json({
      success: false,
      message: err ? err.message || err : "An error occurred",
    });
};

module.exports = errorHandler;
