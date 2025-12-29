import React, { useState, useMemo, useRef } from 'react';

export default function ProjectGrid({ projects }) {
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const videoRefs = useRef({});

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return projects.filter(p => 
      p.data.title.toLowerCase().includes(lowerSearch) ||
      p.data.genre.toLowerCase().includes(lowerSearch) ||
      p.data.stack.some(tech => tech.toLowerCase().includes(lowerSearch))
    );
  }, [search, projects]);

  // Determine which items to display
  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6);
  const hasMore = filteredProjects.length > 6;

  // Video Hover Handlers
  const handleMouseEnter = (slug) => {
    const vid = videoRefs.current[slug];
    if (vid) vid.play().catch(() => {}); // Ignore play interruptions
  };

  const handleMouseLeave = (slug) => {
    const vid = videoRefs.current[slug];
    if (vid) {
      vid.pause();
      vid.currentTime = 0;
    }
  };

  return (
    <div className="project-grid-wrapper">
      {/* Header with Search */}
      <div className="section-header">
        <div className="header-left">
          <h2>Selected Works</h2>
          <div className="line"></div>
        </div>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input glass-panel"
          />
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {/* Grid */}
      <div className="grid-container">
        {displayedProjects.length > 0 ? (
          displayedProjects.map((project) => (
            <a 
              key={project.slug}
              href={`${import.meta.env.BASE_URL}projects/${project.slug}/`.replace(/\/+/g, '/')} 
              className="project-card glass-panel group"
              onMouseEnter={() => handleMouseEnter(project.slug)}
              onMouseLeave={() => handleMouseLeave(project.slug)}
            >
              <div className="media-container">
                {project.data.video && (
                  <video 
                    ref={el => videoRefs.current[project.slug] = el}
                    src={project.data.video} 
                    muted loop playsInline 
                    className="hover-video"
                  />
                )}
                <img 
                  src={project.data.image.src} 
                  alt={project.data.title}
                  width={800} height={600}
                  className="thumbnail"
                  style={{ viewTransitionName: `project-media-${project.slug}` }}
                />
              </div>
              
              <div className="card-details">
                <div className="meta-row">
                  <span className="genre">{project.data.genre}</span>
                </div>
                <h3 style={{ viewTransitionName: `project-title-${project.slug}` }}>
                  {project.data.title}
                </h3>
                <div className="tags-container">
                  {project.data.stack.slice(0, 3).map(t => (
                    <span key={t} className="tech-tag">{t}</span>
                  ))}
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="no-results">No projects found.</div>
        )}
      </div>

      {/* Show More / Less Button */}
      {hasMore && (
        <div className="pagination-container">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="show-more-btn glass-panel"
          >
            {showAll ? 'Show Less' : `Show More (${filteredProjects.length - 6})`}
          </button>
        </div>
      )}
    </div>
  );
}