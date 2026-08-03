'use client';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type IssueStatus = 'open' | 'in-progress' | 'resolved';

type IssueStatusFilter = 'all' | IssueStatus;

type IssuePriority = 'low' | 'medium' | 'high';

type Issue = {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: string;
  createdAt: string;
};

const initialIssues: Issue[] = [
  {
    id: '1',
    title: 'Login button does not work',
    description: 'The user cannot submit the login form.',
    status: 'open',
    priority: 'high',
    assignee: 'Federico',
    createdAt: '2026-08-01',
  },
  {
    id: '2',
    title: 'Improve dashboard loading state',
    description: 'Add skeletons while dashboard data is loading.',
    status: 'in-progress',
    priority: 'medium',
    assignee: 'Martín',
    createdAt: '2026-08-02',
  },
  {
    id: '3',
    title: 'Update footer links',
    description: 'Some footer links point to old pages.',
    status: 'resolved',
    priority: 'low',
    assignee: 'Daniel',
    createdAt: '2026-07-29',
  },
];

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [status, setStatus] = useState<IssueStatusFilter>('all');
  const [newIssue, setNewIssue] = useState<Issue>({
    id: uuidv4(),
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    assignee: '',
    createdAt: new Date().toISOString(),
  });

  const [query, setQuery] = useState('');

  const filteredIssues = issues.filter((issue) => {
    const q = query.toLowerCase();

    const textMatch =
      issue.title.toLowerCase().includes(q) ||
      issue.description.toLowerCase().includes(q) ||
      issue.assignee.toLowerCase().includes(q);

    const statusMatch =
      issue.status === status ? status : status === 'all' ? true : false;

    return textMatch && statusMatch;
  });

  function handleChange( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setNewIssue({
      ...newIssue,
      [name]: value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if(!newIssue.title || !newIssue.status || !newIssue.description || !newIssue.priority ) return
    setIssues([...issues, newIssue]);
    setNewIssue({
      id: uuidv4(),
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
      assignee: '',
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div>
          <h3>Find a Issue by title</h3>
          <input
            type="text"
            placeholder="Search issues..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <select
            name="status"
            id="status"
            onChange={(e) => setStatus(e.target.value as IssueStatusFilter)}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title: </label>
            <input
              name="title"
              type="text"
              value={newIssue.title}
              onChange={handleChange}
            />
            <label htmlFor="description">Desc: </label>
            <input
              name="description"
              type="text"
              value={newIssue.description}
              onChange={handleChange}
            />
            <label htmlFor="priority">Priority: </label>
            <input
              name="priority"
              type="text"
              value={newIssue.priority}
              onChange={handleChange}
            />
            <label htmlFor="assignee">Assignee: </label>
            <input
              name="assignee"
              type="text"
              value={newIssue.assignee}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="border border-y-violet-500 rounded-2xl p-2"
            >
              Submit Issue
            </button>
          </form>
        </div>
        <div>
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="border border-amber-500 rounded-2xl p-1.5 my-2.5"
            >
              <h3 className="font-bold">{issue.title}</h3>
              <p>Description: {issue.description}</p>
              <p>Status: {issue.status}</p>
              <p>Priority: {issue.priority}</p>
              <p>Assignee: {issue.assignee}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
