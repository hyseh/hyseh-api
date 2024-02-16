import 'dotenv/config';
import express from 'express';
import supabase from '../../lib/supabase.js';

const router = express.Router();

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
