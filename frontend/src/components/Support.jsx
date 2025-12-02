// SupportPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Support.css';
import pranjal from '../assets/pranjal.jpeg'
import ayushman from '../assets/ayushman.jpeg'
const SupportPage = () => {
  const navigate = useNavigate();

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Ayushman',
      role: 'Project Developer',
      description: 'Full-stack developer specializing in React, Node.js, and database architecture. Manages the technical infrastructure and ensures system reliability.',
      email: 'ayushmanorderflow@gmail.com',
      photo: ayushman, // Replace with actual photo path
      fallbackPhoto: '👨‍💻',
      expertise: ['React.js', 'Node.js', 'MongoDB', 'API Integration', 'System Architecture'],
      phone: '+91 98765 43210'
    },
    {
      id: 2,
      name: 'Pranjal Shivhare',
      role: 'Project Manager',
      description: 'Oversees project development, coordinates between teams, and ensures timely delivery. Manages client relationships and system deployment.',
      email: 'pranjalorderflow@gmail.com',
      photo: pranjal, // Replace with actual photo path
      fallbackPhoto: '👨‍💼',
      expertise: ['Project Management', 'Client Relations', 'System Deployment', 'Team Coordination', 'Quality Assurance'],
      phone: '+91 98765 43211'
    }
  ];

  // Frequently Asked Questions
  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to the login page and click on "Forgot Password". Enter your registered email to receive a reset link.'
    },
    {
      question: 'How do I add new menu items?',
      answer: 'Navigate to "Manage Menu" from the sidebar, click "Add New Item", fill in the details, and save.'
    },
    {
      question: 'Can I access the system from multiple devices?',
      answer: 'Yes, the system is accessible from any device with internet connection. All data syncs in real-time.'
    },
    {
      question: 'How do I generate sales reports?',
      answer: 'Go to "Sales Analysis" section from the sidebar. You can filter by date range and export reports.'
    },
    {
      question: 'What should I do if orders are not syncing?',
      answer: 'Check your internet connection first. If issue persists, contact our technical support team.'
    }
  ];

  // Contact form handler
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      urgency: formData.get('urgency')
    };
    
    console.log('Contact form submitted:', contactData);
    alert('Thank you for your message! We will get back to you within 24 hours.');
    e.target.reset();
  };

  return (
    <div className="support-page">
      {/* Header */}
      <header className="support-header">
        <div className="header-content">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <h1>🆘 Support</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="support-content">
        {/* Hero Section */}
        {/* <div className="hero-section">
          <div className="hero-text">
            <h2>We're Here to Help</h2>
            <p>
              Our dedicated team is available to assist you with any questions or issues 
              regarding the OrderFlow Restaurant Management System. Whether it's technical 
              support, feature requests, or general inquiries, we're just a message away.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">System Monitoring</span>
              </div>
              <div className="stat">
                <span className="stat-number">&lt;2h</span>
                <span className="stat-label">Response Time</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="support-illustration">💬</div>
          </div>
        </div> */}

        {/* Team Section */}
        <section className="team-section">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">Direct contacts for technical and management support</p>
          
          <div className="team-grid">
            {teamMembers.map(member => (
              <div key={member.id} className="team-card">
                <div className="team-photo">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="member-photo" />
                  ) : (
                    <div className="photo-fallback">{member.fallbackPhoto}</div>
                  )}
                </div>
                
                <div className="team-info">
                  <h3 className="member-name">{member.name}</h3>
                  <span className="member-role">{member.role}</span>
                  
                  <p className="member-description">{member.description}</p>
{/*                   
                  <div className="member-expertise">
                    <h4>Areas of Expertise:</h4>
                    <div className="expertise-tags">
                      {member.expertise.map((skill, index) => (
                        <span key={index} className="expertise-tag">{skill}</span>
                      ))}
                    </div>
                  </div> */}
                  
                  <div className="contact-info">
                    <div className="contact-item">
                      <span className="contact-icon">📧</span>
                      <a href={`mailto:${member.email}`} className="contact-link">
                        {member.email}
                      </a>
                    </div>
                    <div className="contact-item">
                      <span className="contact-icon">📱</span>
                      <span className="contact-text">{member.phone}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="contact-btn"
                    onClick={() => window.location.href = `mailto:${member.email}`}
                  >
                    Send Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

    
      

   
      </main>

      {/* Footer */}
    
    </div>
  );
};

export default SupportPage;