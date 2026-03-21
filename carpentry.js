/* ============================================
   BESPOKE CARPENTRY — App Logic
   Tab switching, filtering, collapsibles, project builder
   ============================================ */

(function() {
  'use strict';

  // ---- TAB NAVIGATION ----
  function initTabs() {
    var tabs = document.querySelectorAll('.carp-tab');
    var panels = document.querySelectorAll('.carp-panel');

    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var target = this.getAttribute('data-tab');

        tabs.forEach(function(t) { t.classList.remove('active'); });
        panels.forEach(function(p) { p.classList.remove('active'); });

        this.classList.add('active');
        var panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ---- COLLAPSIBLE SECTIONS ----
  function initCollapsibles() {
    document.querySelectorAll('.carp-collapse-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var content = this.nextElementSibling;
        var isOpen = content.classList.contains('open');

        content.classList.toggle('open');
        this.classList.toggle('open');
        content.style.maxHeight = isOpen ? '0' : content.scrollHeight + 'px';
      });
    });
  }

  // ---- WOOD FILTER ----
  function initWoodFilter() {
    var btns = document.querySelectorAll('.wood-filter-btn');
    var cards = document.querySelectorAll('.wood-card');

    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var filter = this.getAttribute('data-filter');

        btns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');

        cards.forEach(function(card) {
          if (filter === 'all' || card.getAttribute('data-type') === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- TOOL FILTER ----
  function initToolFilter() {
    var btns = document.querySelectorAll('.tool-filter-btn');
    var cards = document.querySelectorAll('.tool-card');

    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var filter = this.getAttribute('data-filter');

        btns.forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');

        cards.forEach(function(card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- PROJECT BUILDER ----
  var projects = [
    {
      id: 'cutting-board',
      name: 'Cutting Board',
      level: 'beginner',
      location: 'indoor',
      hours: '3-4',
      cost: '€20-40',
      wood: ['Maple', 'Walnut', 'Cherry'],
      tools: ['Hand saw or circular saw', 'Clamps', 'Sandpaper (80-220 grit)', 'Wood glue', 'Mineral oil for finishing'],
      steps: ['Select and purchase hardwood boards', 'Cut boards to equal lengths', 'Glue boards edge-to-edge with clamps', 'Let dry 24 hours', 'Sand flat through grits (80→120→180→220)', 'Round edges with sandpaper', 'Apply food-safe mineral oil finish'],
      description: 'A classic first project. Learn glue-ups, sanding, and food-safe finishing.'
    },
    {
      id: 'floating-shelf',
      name: 'Floating Shelf',
      level: 'beginner',
      location: 'indoor',
      hours: '2-3',
      cost: '€15-30',
      wood: ['Pine', 'Oak', 'Walnut'],
      tools: ['Circular saw or hand saw', 'Drill/driver', 'Level', 'Sandpaper', 'Wall anchors & screws'],
      steps: ['Cut wood to desired shelf length', 'Sand all surfaces smooth', 'Apply stain or oil finish', 'Install hidden bracket or French cleat to wall', 'Mount shelf on bracket', 'Check level and adjust'],
      description: 'Simple wall-mounted shelf using a hidden bracket or French cleat system.'
    },
    {
      id: 'picture-frame',
      name: 'Picture Frame',
      level: 'beginner',
      location: 'indoor',
      hours: '2-3',
      cost: '€10-20',
      wood: ['Pine', 'Oak', 'Walnut'],
      tools: ['Miter saw or miter box with hand saw', 'Clamps', 'Wood glue', 'Sandpaper', 'Frame hardware'],
      steps: ['Measure artwork/photo to determine frame size', 'Cut 4 pieces with 45° miter cuts', 'Dry-fit to check joints', 'Glue and clamp miters', 'Sand smooth after drying', 'Apply finish', 'Add glass, backing, and hanging hardware'],
      description: 'Practice precise miter cuts and learn to make tight corner joints.'
    },
    {
      id: 'wooden-box',
      name: 'Storage Box with Lid',
      level: 'beginner',
      location: 'indoor',
      hours: '4-6',
      cost: '€25-45',
      wood: ['Pine', 'Cedar', 'Walnut'],
      tools: ['Hand saw or table saw', 'Drill/driver', 'Clamps', 'Wood glue', 'Sandpaper', 'Small hinges'],
      steps: ['Cut sides, bottom, and lid pieces', 'Sand all pieces', 'Assemble sides with glue and nails/screws', 'Attach bottom panel', 'Fit lid and attach with small hinges', 'Sand entire box', 'Apply finish of choice'],
      description: 'Learn basic box construction, hinge installation, and creating a fitted lid.'
    },
    {
      id: 'coffee-table',
      name: 'Coffee Table',
      level: 'intermediate',
      location: 'indoor',
      hours: '12-18',
      cost: '€80-200',
      wood: ['Oak', 'Walnut', 'Ash'],
      tools: ['Table saw or circular saw with guide', 'Router', 'Drill/driver', 'Clamps', 'Orbital sander', 'Wood glue', 'Pocket hole jig'],
      steps: ['Design table dimensions (standard: 48×24×18")', 'Mill lumber to thickness', 'Glue up tabletop from boards', 'Cut and shape legs (tapered or straight)', 'Build apron/stretcher frame', 'Join legs to apron with mortise-tenon or pocket screws', 'Attach tabletop with figure-8 fasteners', 'Sand through grits', 'Apply finish (oil, poly, or lacquer)'],
      description: 'A substantial furniture project introducing joinery, panel glue-ups, and finishing techniques.'
    },
    {
      id: 'bookshelf',
      name: 'Bookshelf',
      level: 'intermediate',
      location: 'indoor',
      hours: '10-16',
      cost: '€60-150',
      wood: ['Pine', 'Oak', 'Plywood with hardwood edge banding'],
      tools: ['Circular saw or table saw', 'Drill/driver', 'Pocket hole jig', 'Level', 'Clamps', 'Orbital sander', 'Edge banding iron (if using plywood)'],
      steps: ['Design shelf layout and dimensions', 'Cut sides, top, bottom, shelves, and back panel', 'Cut dadoes for fixed shelves (optional)', 'Drill shelf pin holes for adjustable shelves', 'Assemble carcass with pocket screws or dadoes', 'Attach back panel for rigidity', 'Sand and finish', 'Secure to wall for safety'],
      description: 'Build a functional bookshelf with fixed or adjustable shelving. Great introduction to carcass construction.'
    },
    {
      id: 'workbench',
      name: 'Workbench',
      level: 'intermediate',
      location: 'indoor',
      hours: '16-24',
      cost: '€100-300',
      wood: ['Construction lumber (2x4s, 2x6s)', 'Plywood or MDF for top', 'Hardwood for vise jaw'],
      tools: ['Circular saw', 'Drill/driver', 'Impact driver', 'Clamps', 'Level', 'Speed square', 'Wood screws', 'Carriage bolts'],
      steps: ['Design bench to your height (knuckle height)', 'Cut all lumber to length', 'Build leg assemblies', 'Connect with stretchers', 'Laminate top from 2x4s or 2x6s', 'Flatten top with hand plane or belt sander', 'Install front vise', 'Add tool tray, shelf, or drawers as desired', 'Apply protective finish (Danish oil or polyurethane)'],
      description: 'Every woodworker needs a solid workbench. This is a workshop essential that teaches heavy-duty construction.'
    },
    {
      id: 'planter-box',
      name: 'Outdoor Planter Box',
      level: 'intermediate',
      location: 'outdoor',
      hours: '6-10',
      cost: '€40-80',
      wood: ['Cedar', 'Pressure-treated pine', 'Teak'],
      tools: ['Circular saw', 'Drill/driver', 'Exterior wood screws', 'Clamps', 'Sandpaper', 'Exterior wood finish'],
      steps: ['Design planter dimensions', 'Cut side panels and bottom', 'Drill drainage holes in bottom', 'Assemble with exterior-grade screws', 'Line interior with landscape fabric', 'Sand exterior', 'Apply exterior finish (spar urethane or exterior oil)', 'Optional: add feet for drainage clearance'],
      description: 'Build weather-resistant planters. Introduces outdoor wood selection and weather-proof finishing.'
    },
    {
      id: 'dining-table',
      name: 'Dining Table',
      level: 'advanced',
      location: 'indoor',
      hours: '30-50',
      cost: '€200-600',
      wood: ['Walnut', 'Oak', 'Maple', 'Cherry'],
      tools: ['Table saw', 'Jointer', 'Planer', 'Router', 'Clamps (many)', 'Orbital sander', 'Hand plane', 'Chisels', 'Drill/driver'],
      steps: ['Design table (standard dining: 72×36×30")', 'Mill rough lumber: joint, plane, rip to width', 'Arrange boards for grain match', 'Edge-glue tabletop in stages', 'Flatten with router sled or hand planes', 'Cut breadboard ends with mortise-and-tenon', 'Build trestle or leg assembly', 'Join base to top allowing for wood movement', 'Sand through 320 grit', 'Apply multi-coat finish'],
      description: 'A showpiece project requiring precision milling, panel flattening, and advanced joinery. Allow for wood movement.'
    },
    {
      id: 'chest-of-drawers',
      name: 'Chest of Drawers',
      level: 'advanced',
      location: 'indoor',
      hours: '40-60',
      cost: '€250-500',
      wood: ['Walnut', 'Cherry', 'Maple (carcass)', 'Poplar (drawer boxes)'],
      tools: ['Table saw', 'Router with dovetail jig', 'Planer', 'Drill press', 'Clamps', 'Chisels', 'Orbital sander', 'Drawer slides'],
      steps: ['Design dimensions and number of drawers', 'Mill all lumber to dimension', 'Cut dovetails or use rabbet joints for drawer boxes', 'Build carcass with dadoes for dividers', 'Install drawer slides (or build wooden runners)', 'Fit drawers with correct gap tolerance', 'Make and attach face frame', 'Build and fit drawer fronts', 'Install hardware (pulls/knobs)', 'Sand and apply finish'],
      description: 'A masterclass in precision. Multiple drawers demand consistent, repeatable accuracy across every component.'
    },
    {
      id: 'garden-bench',
      name: 'Garden Bench',
      level: 'intermediate',
      location: 'outdoor',
      hours: '10-16',
      cost: '€80-180',
      wood: ['Cedar', 'Teak', 'White Oak'],
      tools: ['Circular saw or miter saw', 'Drill/driver', 'Jigsaw (for curved cuts)', 'Clamps', 'Exterior screws', 'Sandpaper', 'Exterior finish'],
      steps: ['Choose a design (flat seat, contoured, or with backrest)', 'Cut seat slats and support pieces', 'Shape legs (straight or curved with jigsaw)', 'Cut armrests if desired', 'Assemble frame with exterior screws', 'Attach seat slats with even spacing', 'Attach backrest slats', 'Sand all surfaces', 'Apply exterior-grade finish', 'Let cure fully before outdoor placement'],
      description: 'Build a durable outdoor bench using naturally weather-resistant wood species.'
    },
    {
      id: 'kitchen-cabinets',
      name: 'Kitchen Cabinets',
      level: 'advanced',
      location: 'indoor',
      hours: '80-120',
      cost: '€500-2000',
      wood: ['Plywood (carcass)', 'Maple or Oak (face frames & doors)', 'Poplar (paint-grade option)'],
      tools: ['Table saw', 'Router', 'Drill press', 'Pocket hole jig', 'Clamps', 'Brad nailer', 'Level', 'Orbital sander', 'Edge banding tools'],
      steps: ['Measure kitchen and design cabinet layout', 'Build base cabinet carcasses from plywood', 'Build wall cabinet carcasses', 'Construct and attach face frames', 'Build doors (frame-and-panel or slab)', 'Install European concealed hinges', 'Build and fit drawers with soft-close slides', 'Install cabinets (level, plumb, square)', 'Add trim, crown molding', 'Finish (paint or clear coat)'],
      description: 'The ultimate woodworking challenge. Requires precision, patience, and a well-equipped shop.'
    },
    {
      id: 'adirondack-chair',
      name: 'Adirondack Chair',
      level: 'intermediate',
      location: 'outdoor',
      hours: '8-12',
      cost: '€50-120',
      wood: ['Cedar', 'Pressure-treated pine', 'Teak'],
      tools: ['Jigsaw', 'Drill/driver', 'Circular saw', 'Sandpaper', 'Exterior screws', 'Template (optional)'],
      steps: ['Cut back legs from wide board using template', 'Cut seat slats, back slats, and armrests', 'Shape armrests with jigsaw', 'Assemble seat frame', 'Attach seat slats with even spacing', 'Attach back slats to back support', 'Join back assembly to seat', 'Attach armrests', 'Sand everything smooth', 'Apply exterior finish or leave to grey naturally'],
      description: 'Classic outdoor chair with angled seat and fan-shaped back. Great template-based project.'
    },
    {
      id: 'shoe-rack',
      name: 'Shoe Rack',
      level: 'beginner',
      location: 'indoor',
      hours: '3-5',
      cost: '€20-40',
      wood: ['Pine', 'Plywood', 'Oak'],
      tools: ['Circular saw or hand saw', 'Drill/driver', 'Sandpaper', 'Wood screws', 'Level'],
      steps: ['Determine number of tiers needed', 'Cut side panels', 'Cut shelf slats or solid shelves', 'Mark shelf positions on sides', 'Attach shelves with screws or dowels', 'Sand smooth', 'Apply finish', 'Place in entryway'],
      description: 'Practical entryway organizer. Simple construction with immediately useful results.'
    },
    {
      id: 'spice-rack',
      name: 'Wall-Mounted Spice Rack',
      level: 'beginner',
      location: 'indoor',
      hours: '2-4',
      cost: '€15-30',
      wood: ['Pine', 'Oak', 'Walnut'],
      tools: ['Hand saw or miter saw', 'Drill/driver', 'Sandpaper', 'Wood glue', 'Wall mounting hardware'],
      steps: ['Cut back panel to size', 'Cut shelf rails (front lip to hold jars)', 'Cut shelf platforms', 'Assemble shelves with glue and small nails', 'Attach shelves to back panel', 'Sand and finish', 'Mount to kitchen wall'],
      description: 'Small, practical kitchen project. Learn precise small-scale joinery.'
    },
    {
      id: 'desk',
      name: 'Writing Desk',
      level: 'intermediate',
      location: 'indoor',
      hours: '15-24',
      cost: '€100-250',
      wood: ['Walnut', 'Oak', 'Maple'],
      tools: ['Table saw or circular saw', 'Router', 'Drill/driver', 'Pocket hole jig', 'Clamps', 'Orbital sander'],
      steps: ['Design desk dimensions (standard: 48-60"×24"×30")', 'Mill and glue up desktop panel', 'Flatten top with router sled or planer', 'Build leg and apron assembly', 'Cut mortise-and-tenon or use pocket screws for leg joints', 'Attach top allowing for wood movement', 'Add cable management hole if desired', 'Optional: add single drawer', 'Sand through grits', 'Apply durable finish'],
      description: 'Build a beautiful writing desk. Introduces proper tabletop construction and wood movement considerations.'
    },
    {
      id: 'jewelry-box',
      name: 'Jewelry Box',
      level: 'intermediate',
      location: 'indoor',
      hours: '8-14',
      cost: '€30-70',
      wood: ['Walnut', 'Cherry', 'Maple with contrasting accents'],
      tools: ['Table saw', 'Router', 'Chisels', 'Hand saw', 'Clamps', 'Sandpaper (to 320 grit)', 'Small hinges', 'Felt lining'],
      steps: ['Design box with compartments and lid', 'Resaw thin boards for sides', 'Cut miters for corners', 'Cut grooves for bottom panel', 'Glue up box with miter joints', 'Create dividers and compartment inserts', 'Build lid with contrasting wood accent', 'Install small brass hinges', 'Sand to very fine grit (320+)', 'Apply multi-coat hand-rubbed finish', 'Line compartments with felt'],
      description: 'Precision small-scale work. Beautiful gift project that develops fine joinery skills.'
    },
    {
      id: 'rocking-chair',
      name: 'Rocking Chair',
      level: 'advanced',
      location: 'indoor',
      hours: '50-80',
      cost: '€200-500',
      wood: ['Walnut', 'Cherry', 'White Oak', 'Ash (for bent parts)'],
      tools: ['Bandsaw', 'Lathe', 'Drill press', 'Spokeshave', 'Drawknife', 'Steam box (for bending)', 'Chisels', 'Hand plane', 'Many clamps'],
      steps: ['Study rocking chair geometry (center of gravity, rocker radius)', 'Design or choose a proven plan', 'Turn or shape legs and stretchers on lathe', 'Steam bend back slats or arm rail', 'Cut seat from thick slab and sculpt with angle grinder/spokeshave', 'Drill angled mortises in seat for legs', 'Assemble chair dry to check fit', 'Glue up in stages', 'Shape and attach rockers', 'Balance and test rock', 'Apply durable finish'],
      description: 'The pinnacle of chair making. Requires steam bending, lathe work, compound angles, and balancing the rock.'
    },
    {
      id: 'deck',
      name: 'Outdoor Deck',
      level: 'advanced',
      location: 'outdoor',
      hours: '60-100',
      cost: '€1000-5000',
      wood: ['Pressure-treated pine (structure)', 'Cedar or composite (decking)', 'Stainless steel hardware'],
      tools: ['Circular saw', 'Miter saw', 'Drill/driver', 'Impact driver', 'Post hole digger', 'Level (4ft)', 'String line', 'Speed square', 'Joist hangers', 'Concrete'],
      steps: ['Check local building codes and get permits', 'Design deck layout and create plans', 'Set post footings with concrete', 'Install ledger board to house (if attached)', 'Set and brace support posts', 'Install beam on posts', 'Install joists with joist hangers (16" on center)', 'Add blocking between joists', 'Install decking boards with proper gaps', 'Build stairs with stringers', 'Install railing system', 'Apply protective finish'],
      description: 'Major outdoor construction project. Requires knowledge of structural engineering, building codes, and weatherproofing.'
    },
    {
      id: 'wine-rack',
      name: 'Wine Rack',
      level: 'beginner',
      location: 'indoor',
      hours: '4-6',
      cost: '€25-50',
      wood: ['Pine', 'Oak', 'Walnut'],
      tools: ['Drill with large Forstner bit or hole saw', 'Circular saw or hand saw', 'Sandpaper', 'Wood glue', 'Clamps'],
      steps: ['Design rack size (number of bottles)', 'Cut side panels and cross pieces', 'Drill bottle-holding holes or cut notches', 'Sand all pieces smooth', 'Assemble with glue and screws', 'Finish with stain or oil', 'Mount to wall or place on counter'],
      description: 'Attractive storage project. Learn to use Forstner bits and create functional curved cuts.'
    }
  ];

  function initProjectBuilder() {
    var form = document.getElementById('project-builder-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var query = document.getElementById('pb-query').value.toLowerCase().trim();
      var level = document.getElementById('pb-level').value;
      var location = document.getElementById('pb-location').value;

      var results = projects.filter(function(p) {
        var matchLevel = level === 'all' || p.level === level;
        var matchLocation = location === 'all' || p.location === location;
        var matchQuery = !query || p.name.toLowerCase().indexOf(query) !== -1 ||
                         p.description.toLowerCase().indexOf(query) !== -1 ||
                         p.wood.some(function(w) { return w.toLowerCase().indexOf(query) !== -1; });
        return matchLevel && matchLocation && matchQuery;
      });

      renderProjectResults(results, query);
    });

    // Show all projects initially
    renderProjectResults(projects, '');
  }

  function renderProjectResults(results, query) {
    var container = document.getElementById('project-results');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = '<div class="glass-card"><p class="card-text" style="text-align:center;">No matching projects found. Try different search terms or filters.</p></div>';
      return;
    }

    var html = '';
    results.forEach(function(p) {
      var levelClass = p.level === 'beginner' ? 'level-beginner' :
                       p.level === 'intermediate' ? 'level-intermediate' : 'level-advanced';
      var levelLabel = p.level.charAt(0).toUpperCase() + p.level.slice(1);
      var locationLabel = p.location === 'indoor' ? 'Indoor' : 'Outdoor';

      html += '<div class="glass-card project-result-card">';
      html += '<div class="project-header">';
      html += '<h3 class="card-title" style="margin-bottom:8px;">' + p.name + '</h3>';
      html += '<div class="project-badges">';
      html += '<span class="project-badge ' + levelClass + '">' + levelLabel + '</span>';
      html += '<span class="project-badge">' + locationLabel + '</span>';
      html += '<span class="project-badge">' + p.hours + ' hours</span>';
      html += '<span class="project-badge">' + p.cost + '</span>';
      html += '</div></div>';
      html += '<p class="card-text">' + p.description + '</p>';

      html += '<div class="project-details">';

      html += '<div class="project-detail-col">';
      html += '<h4>Recommended Wood</h4><ul>';
      p.wood.forEach(function(w) { html += '<li>' + w + '</li>'; });
      html += '</ul></div>';

      html += '<div class="project-detail-col">';
      html += '<h4>Tools Required</h4><ul>';
      p.tools.forEach(function(t) { html += '<li>' + t + '</li>'; });
      html += '</ul></div>';

      html += '</div>';

      html += '<div class="project-steps">';
      html += '<h4>Step-by-Step</h4><ol>';
      p.steps.forEach(function(s) { html += '<li>' + s + '</li>'; });
      html += '</ol></div>';

      html += '</div>';
    });

    container.innerHTML = html;
  }

  // ---- INIT ----
  document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initCollapsibles();
    initWoodFilter();
    initToolFilter();
    initProjectBuilder();
  });

})();
