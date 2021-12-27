export function logErrors(err: any, req: any, res: any, next: any) {
  console.error(err.stack);
  next(err);
}

export function errorHandler(err: any, req: any, res: any, next: any) {
  res.status(500).json({ error: err.message });
}
