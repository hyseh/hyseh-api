import 'dotenv/config';
import express from 'express';
import supabase from '../../lib/supabase.js';

const router = express.Router();

/**
 * @swagger
 * /api/quotes/:
 *  get:
 *    tags:
 *      - Quotes
 *    responses:
 *      200:
 *        description: Successful response
 *      500:
 *        description: Server error
 */
router.get('/', async (req, res) => {
  try {
    let { data: quotes, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(error.status || 500).json({ error });
    } else {
      return res.status(200).json({ quotes });
    }
  } catch (error) {
    throw new Error('An error occured trying to get all quotes', error);
  }
});

/**
 * @swagger
 * /api/quotes/{id}:
 *  get:
 *    tags:
 *      - Quotes
 *    parameters:
 *    - name: id
 *      required: true
 *      in: path
 *      schema:
 *        type: integer
 *    responses:
 *      200:
 *        description: Successful response
 *      404:
 *        description: Quote not found
 *      500:
 *        description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    let { data: quote, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', req.params.id);

    if (error) {
      return res.status(error.status || 500).json({ error });
    } else {
      if (quote.length === 0) {
        return res.status(404).json({
          error: {
            status: 404,
            message: `Could not find quote with id ${req.params.id}`,
          },
        });
      }

      return res.status(200).json({ quote });
    }
  } catch (error) {
    throw new Error('An error occured trying to get a quote', error);
  }
});

/**
 * @swagger
 * /api/quotes/:
 *  post:
 *    tags:
 *      - Quotes
 *    parameters:
 *    - name: body
 *      required: true
 *      in: body
 *      schema:
 *        type: object
 *        properties:
 *          author:
 *            type: string
 *          content:
 *            type: string
 *    responses:
 *      201:
 *        description: Successful response
 *      400:
 *        description: Body is required
 *      500:
 *        description: Server error
 */
router.post('/', async (req, res) => {
  const { author, content } = req.body;
  if (!author || !author.trim()) {
    return res
      .status(400)
      .json({ error: { status: 400, message: 'Author is required' } });
  }
  if (!content || !content.trim()) {
    return res
      .status(400)
      .json({ error: { status: 400, message: 'Content is required' } });
  }

  try {
    const { data, error } = await supabase
      .from('quotes')
      .insert([{ author: author, content: content }])
      .select();

    if (error) {
      return res.status(error.status || 500).json({ error });
    } else {
      return res
        .status(201)
        .json({ data, message: 'Success! A new quote was added' });
    }
  } catch (error) {
    throw new Error('An error occured trying to post a new quote', error);
  }
});

/**
 * @swagger
 * /api/quotes/{id}:
 *  patch:
 *    tags:
 *      - Quotes
 *    parameters:
 *    - name: id
 *      required: true
 *      in: path
 *      schema:
 *        type: integer
 *    - name: author
 *      in: body
 *      schema:
 *        type: object
 *        properties:
 *          author:
 *            type: string
 *    - name: content
 *      in: body
 *      schema:
 *        type: object
 *        properties:
 *          content:
 *            type: string
 *    responses:
 *      201:
 *        description: Successful response
 *      400:
 *        description: Author or content is required
 *      404:
 *        description: Quote not found
 *      500:
 *        description: Server error
 */
router.patch('/:id', async (req, res) => {
  const { author, content } = req.body;
  if ((!author || !author.trim()) && (!content || !content.trim())) {
    return res.status(400).json({
      error: { status: 400, message: 'Must contain author or conent.' },
    });
  }

  try {
    let { data: quote, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', req.params.id);

    if (error) {
      return res.status(error.status || 500).json({ error });
    }

    if (quote.length === 0) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Could not find quote with id ${req.params.id}`,
        },
      });
    }

    const fields = {};
    if (author && author.trim()) fields.author = author.trim();
    if (content && content.trim()) fields.content = content.trim();

    try {
      const { data, error } = await supabase
        .from('quotes')
        .update(fields)
        .eq('id', req.params.id)
        .select();

      if (error) {
        return res.status(error.status || 500).json({ error });
      } else {
        return res
          .status(200)
          .json({ data, message: 'Success! Quote was updated' });
      }
    } catch (error) {
      throw new Error('An error occured trying to patch a quote', error);
    }
  } catch (error) {
    throw new Error('An error occured checking for existing quote', error);
  }
});

/**
 * @swagger
 * /api/quotes/{id}:
 *  delete:
 *    tags:
 *      - Quotes
 *    parameters:
 *    - name: id
 *      required: true
 *      in: path
 *      schema:
 *        type: integer
 *    responses:
 *      204:
 *        description: Successful response
 *      404:
 *        description: Quote not found
 *      500:
 *        description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    let { data: quote, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', req.params.id);

    if (error) {
      return res.status(error.status || 500).json({ error });
    }

    if (quote.length === 0) {
      return res.status(404).json({
        error: {
          status: 404,
          message: `Could not find quote with id ${req.params.id}`,
        },
      });
    }

    try {
      const { data, error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', req.params.id);

      if (error) {
        return res.status(error.status || 500).json({ error });
      } else {
        return res.status(204).json({ message: 'Success! Quote was deleted' });
      }
    } catch (error) {
      throw new Error('An error occured trying to delete a quote', error);
    }
  } catch (error) {
    throw new Error('An error occured checking for existing quote', error);
  }
});

export default router;
