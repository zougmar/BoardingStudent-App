import { Router } from 'express';
import { Resource } from '../models';
import { requireAuth } from '../auth';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    requireAuth(_req);
    const list = await Resource.find().sort({ category: 1, title: 1 });
    res.json(list.map((r: any) => ({
      id: r._id.toString(),
      title: r.title,
      category: r.category,
      description: r.description,
      content: r.content,
      link: r.link ?? undefined,
      updatedAt: r.updatedAt,
    })));
  } catch (e) {
    next(e);
  }
});

export default router;
