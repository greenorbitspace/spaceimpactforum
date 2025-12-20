<script type="module">
fetch('/data/schedule.json')
  .then(res => res.json())
  .then(data => {
    const tabsContainer = document.querySelector('#schedule-tabs');
    const tabContent = document.querySelector('#schedule-tabContent');

    if (!data?.days?.length) return;

    data.days.forEach((day, i) => {
      // --- Create tab button ---
      const li = document.createElement('li');
      li.classList.add('nav-item');
      li.setAttribute('role', 'presentation');

      li.innerHTML = `
        <button class="nav-link ${i === 0 ? 'active' : ''}" 
                id="schedule-tab-${i+1}" 
                data-bs-toggle="tab" 
                data-bs-target="#schedule-day-${i+1}" 
                type="button" 
                role="tab" 
                aria-controls="schedule-day-${i+1}" 
                aria-selected="${i === 0}">
          ${new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}<br>${day.label}
        </button>`;
      tabsContainer.appendChild(li);

      // --- Create tab pane ---
      const tabPane = document.createElement('div');
      tabPane.classList.add('tab-pane', 'fade', i === 0 ? 'show' : '', i === 0 ? 'active' : '');
      tabPane.id = `schedule-day-${i+1}`;
      tabPane.setAttribute('role', 'tabpanel');
      tabPane.setAttribute('aria-labelledby', `schedule-tab-${i+1}`);

      const timeline = document.createElement('div');
      timeline.classList.add('schedule-content');

      day.sessions?.forEach(session => {
        // If parallel sessions, iterate sub-sessions
        if (session.type === 'parallel' && session.sessions?.length) {
          session.sessions.forEach(sub => {
            const block = document.createElement('div');
            block.classList.add('session-block');

            block.innerHTML = `
              <div class="session-time">
                ${sub.start ? `<span class="start">${sub.start}</span>` : ''}
                ${sub.end ? `<span class="end">${sub.end}</span>` : ''}
              </div>
              <div class="session-card ${sub.track?.toLowerCase() === 'break' ? 'break-card' : ''}">
                <div class="session-info">
                  <div class="session-meta">
                    ${sub.track ? `<span class="track ${sub.track.toLowerCase()}">${sub.track}</span>` : ''}
                    ${sub.room ? `<span class="room">${sub.room}</span>` : ''}
                  </div>
                  ${sub.title ? `<h3 class="session-title">${sub.title}</h3>` : ''}
                  ${sub.description ? `<p class="session-description">${sub.description}</p>` : ''}
                </div>
              </div>`;
            timeline.appendChild(block);
          });
        } else {
          const block = document.createElement('div');
          block.classList.add('session-block');

          block.innerHTML = `
            <div class="session-time">
              ${session.start ? `<span class="start">${session.start}</span>` : ''}
              ${session.end ? `<span class="end">${session.end}</span>` : ''}
            </div>
            <div class="session-card ${session.track?.toLowerCase() === 'break' ? 'break-card' : ''}">
              <div class="session-info">
                <div class="session-meta">
                  ${session.track ? `<span class="track ${session.track.toLowerCase()}">${session.track}</span>` : ''}
                  ${session.room ? `<span class="room">${session.room}</span>` : ''}
                </div>
                ${session.title ? `<h3 class="session-title">${session.title}</h3>` : ''}
                ${session.description ? `<p class="session-description">${session.description}</p>` : ''}
                ${session.speakers?.map(s => `
                  <div class="speaker-info">
                    ${s.avatar ? `<img src="${s.avatar}" class="speaker-avatar img-fluid" alt="">` : ''}
                    <div class="speaker-details">
                      ${s.name ? `<h4 class="speaker-name">${s.name}</h4>` : ''}
                      ${s.role ? `<span class="speaker-role">${s.role}</span>` : ''}
                    </div>
                  </div>`).join('') || ''}
              </div>
              ${session.track?.toLowerCase() !== 'break' ? '<button class="add-to-schedule"><i class="bi bi-calendar-plus"></i> Add to Schedule</button>' : ''}
            </div>`;
          timeline.appendChild(block);
        }
      });

      tabPane.appendChild(timeline);
      tabContent.appendChild(tabPane);
    });
  })
  .catch(err => console.error('Error loading schedule:', err));
</script>