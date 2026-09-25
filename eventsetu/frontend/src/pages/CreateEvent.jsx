import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const emptyForm = {
  title: '', description: '', category: 'General', date: '', time: '',
  location: '', image: '', price: 0, totalSeats: 50,
};

const CreateEvent = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      api.get(`/events/${id}`).then(({ data }) => {
        setForm({
          ...data,
          date: data.date?.slice(0, 10),
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/events/${id}`, form);
      } else {
        await api.post('/events', form);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl mb-8">{isEdit ? 'Edit Event' : 'Create Event'}</h1>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-ink/70 block mb-1">Title</label>
          <input name="title" required className="input-field" value={form.title} onChange={handleChange} />
        </div>
        <div>
          <label className="text-sm text-ink/70 block mb-1">Description</label>
          <textarea name="description" required rows={4} className="input-field" value={form.description} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-ink/70 block mb-1">Category</label>
            <select name="category" className="input-field" value={form.category} onChange={handleChange}>
              {['General', 'Tech', 'Music', 'Business', 'Sports', 'Workshop'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-ink/70 block mb-1">Price (₹, 0 = free)</label>
            <input name="price" type="number" min={0} className="input-field" value={form.price} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-ink/70 block mb-1">Date</label>
            <input name="date" type="date" required className="input-field" value={form.date} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm text-ink/70 block mb-1">Time</label>
            <input name="time" type="time" required className="input-field" value={form.time} onChange={handleChange} />
          </div>
        </div>
        <div>
          <label className="text-sm text-ink/70 block mb-1">Location</label>
          <input name="location" required className="input-field" value={form.location} onChange={handleChange} />
        </div>
        <div>
          <label className="text-sm text-ink/70 block mb-1">Image URL (optional)</label>
          <input name="image" className="input-field" value={form.image} onChange={handleChange} />
        </div>
        <div>
          <label className="text-sm text-ink/70 block mb-1">Total Seats</label>
          <input name="totalSeats" type="number" min={1} required className="input-field" value={form.totalSeats} onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
