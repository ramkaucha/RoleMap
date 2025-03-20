import { Application, ApplicationStatus } from '@/components/type/application';

export const generateSampleApplications = () => {
  const companies = [
    'Google',
    'Amazon',
    'Microsoft',
    'Apple',
    'Meta',
    'Netflix',
    'Uber',
    'Airbnb',
    'Twitter',
    'Stripe',
    'Shopify',
    'Square',
    'Lyft',
    'Adobe',
    'Salesforce',
    'Oracle',
    'IBM',
    'Intel',
    'Cisco',
    'Dell',
    'PayPal',
    'Dropbox',
    'Slack',
    'Zoom',
    'Twilio',
    'Pinterest',
    'Snap',
    'SpaceX',
  ];

  const roles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Engineer',
    'DevOps Engineer',
    'Data Scientist',
    'Machine Learning Engineer',
    'Product Manager',
    'UI/UX Designer',
    'QA Engineer',
    'Site Reliability Engineer',
    'Mobile Developer',
    'Cloud Architect',
    'Systems Engineer',
    'Network Engineer',
    'Security Engineer',
    'Data Engineer',
    'Database Administrator',
    'Technical Writer',
    'Scrum Master',
  ];

  const locations = [
    'San Francisco, CA',
    'New York, NY',
    'Seattle, WA',
    'Austin, TX',
    'Boston, MA',
    'Chicago, IL',
    'Los Angeles, CA',
    'Denver, CO',
    'Atlanta, GA',
    'Remote',
    'Portland, OR',
    'Washington D.C.',
    'Dallas, TX',
    'Miami, FL',
    'Phoenix, AZ',
  ];

  const categories = [
    'Software',
    'AI/ML',
    'DevOps',
    'Data',
    'Product',
    'Design',
    'QA',
    'Mobile',
    'Infrastructure',
    'Security',
    'Frontend',
    'Backend',
  ];

  const comments = [
    'Applied through referral',
    'Completed first round',
    'Waiting for response',
    'Technical interview scheduled',
    'Rejected after final interview',
    'Offer received',
    'Need to follow up',
    'Assessment completed',
    'Onsite scheduled',
    null,
  ];

  const applications: Application[] = [];

  for (let i = 1; i <= 25; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const status =
      Object.values(ApplicationStatus)[
        Math.floor(Math.random() * Object.values(ApplicationStatus).length)
      ];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const comment = comments[Math.floor(Math.random() * comments.length)];

    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const randomDate = new Date(
      threeMonthsAgo.getTime() +
        Math.random() * (today.getTime() - threeMonthsAgo.getTime())
    );

    const updatedDate = new Date(randomDate);
    updatedDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 11));

    applications.push({
      id: i,
      company,
      role,
      status,
      location,
      link: '#',
      comments: comment,
      category,
      date_applied: randomDate,
      user_id: 1,
      created_at: randomDate,
      updated_at: updatedDate,
    });
  }

  return applications.sort(
    (a, b) => b.date_applied.getTime() - a.date_applied.getTime()
  );
};
