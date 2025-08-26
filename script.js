/* Mobile nav */
const menuBtn = document.querySelector('.menu-btn');
const navList = document.querySelector('nav ul');
if (menuBtn) {
  menuBtn.addEventListener('click', () => navList.classList.toggle('open'));
}

/* Highlight active nav link */
const here = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(a=>{
  const href = a.getAttribute('href');
  if ((here === '' && href === 'index.html') || href === here) a.classList.add('active');
});

/* Opening hours helper (shows "Open now/Closed") */
function setOpenStatus() {
  const badge = document.querySelector('[data-open-badge]');
  if (!badge) return;
  // Opening hours: Mon–Sun 08:00–17:00
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const hour = now.getHours() + now.getMinutes()/60;
  const open = hour >= 8 && hour < 17; // 08:00-17:00 daily
  const openToday = (day >= 0 && day <= 6);
  badge.textContent = (openToday && open) ? 'Open now' : 'Closed';
  badge.className = 'badge ' + ((openToday && open) ? '' : '');
}
setOpenStatus();

/* Simple booking calendar (used on contact.html) */
function Calendar(el){
  if (!el) return;
  const head = el.querySelector('.cal-head');
  const grid = el.querySelector('.grid');
  const title = head.querySelector('[data-title]');
  let view = new Date(); view.setDate(1);
  let selected = null;

  function draw(){
    grid.innerHTML='';
    const month = view.getMonth(), year=view.getFullYear();
    title.textContent = view.toLocaleString('default',{month:'long', year:'numeric'});
    const startDay = new Date(year,month,1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month+1, 0).getDate();

    // Day-of-week header
    const dows = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    dows.forEach(d=>{ const div=document.createElement('div'); div.className='dow'; div.textContent=d; grid.appendChild(div); });

    // Empty cells for offset
    for(let i=0;i<startDay;i++){ const s=document.createElement('div'); grid.appendChild(s); }

    // Days
    for(let d=1; d<=daysInMonth; d++){
      const cell = document.createElement('div');
      cell.className='day';
      cell.textContent=d;
      cell.setAttribute('role','button');
      cell.addEventListener('click', ()=>{
        selected = new Date(year,month,d);
        grid.querySelectorAll('.day').forEach(x=>x.classList.remove('selected'));
        cell.classList.add('selected');
        const field = document.querySelector('#booking-date');
        if (field) field.value = selected.toISOString().split('T')[0];
      });
      grid.appendChild(cell);
    }
  }
  head.querySelector('[data-prev]').onclick = ()=>{ view.setMonth(view.getMonth()-1); draw(); };
  head.querySelector('[data-next]').onclick = ()=>{ view.setMonth(view.getMonth()+1); draw(); };
  draw();
}
Calendar(document.querySelector('.calendar'));

/* Enquiry form faux-submit */
const enquiryForm = document.querySelector('#enquiry-form');
if (enquiryForm){
  enquiryForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(enquiryForm);
    alert(`Thanks, ${data.get('name')}! We’ll get back to you at ${data.get('email')} about “${data.get('subject')}”.`);
    enquiryForm.reset();
  });
}

/* Booking form faux-submit on contact page */
const bookingForm = document.querySelector('#booking-form');
if (bookingForm){
  bookingForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(bookingForm);
    alert(`Booking request received for ${data.get('people')} people on ${data.get('date')} at ${data.get('time')}. We’ll confirm via ${data.get('email')}.`);
    bookingForm.reset();
  });
}