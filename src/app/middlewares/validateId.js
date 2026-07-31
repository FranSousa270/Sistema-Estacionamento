export function validateId(req, res, next) {
  let id = Number(req.params.id);
  if (Number.isNaN(id) || id <= 0) {
    return res.status(400).json({
      message: "id inválido",
    });
  }

  req.params.id = id;

  next();
}
