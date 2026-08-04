(function () {
  "use strict";

  var assetVersion = "?v=20260804-1935";
  var projects = [
    {
      id: "cyprus-construction",
      name: "Cyprus Construction",
      description: "مجموعه‌ای از پروژه‌های مسکونی و ویلایی Cyprus Constructions؛ رفرنس ارائه‌شده شامل کالکشن‌هایی مانند Maldives Homes، IDYLL Homes، Mykonos Homes و Pearl Island Homes است.",
      assets: ["خانه‌های مسکونی", "ویلا", "ریزورت", "تصاویر پروژه"],
      images: ["assets/gold-projects/cyprus-1.webp", "assets/gold-projects/cyprus-2.webp"]
    },
    {
      id: "caesar-projects",
      name: "Caesar Projects",
      description: "پورتفوی پروژه‌های Afik Group با مجموعه‌هایی مانند Caesar Bay، Caesar Beach، Caesar Blue، Caesar Breeze، Caesar Cliff و Caesar Resort.",
      assets: ["رندر معماری", "فضاهای مجموعه", "تصاویر پروژه", "مجموعه‌های Caesar"],
      images: ["assets/gold-projects/caesar-1.webp", "assets/gold-projects/caesar-2.webp"]
    },
    {
      id: "noyanlar-projects",
      name: "Noyanlar Projects",
      description: "مرور تصویری پروژه‌های Noyanlar بر پایه بسته مرجع ارائه‌شده؛ شامل پلان‌ها، مدارک عمومی، رندرهای سه‌بعدی، کاتالوگ، ویدئو و تصاویر پروژه.",
      assets: ["پلان", "مدارک پروژه", "رندر سه‌بعدی", "کاتالوگ", "ویدئو", "عکس"],
      images: ["assets/gold-projects/noyanlar-1.webp", "assets/gold-projects/noyanlar-2.webp"]
    },
    {
      id: "riverside",
      name: "Riverside",
      description: "معرفی تصویری Riverside با استفاده از رفرنس‌های رسمی ارائه‌شده؛ پوشه پروژه شامل پلان، مدارک، رندر سه‌بعدی، کاتالوگ، ویدئو و عکس است.",
      assets: ["پلان", "مدارک پروژه", "رندر سه‌بعدی", "کاتالوگ", "ویدئو", "عکس"],
      images: ["assets/gold-projects/riverside-1.webp", "assets/gold-projects/riverside-2.webp"]
    },
    {
      id: "long-beach-park",
      name: "Long Beach Park Residence",
      description: "نمایی کوتاه از Long Beach Park Residence بر اساس رفرنس پروژه؛ مجموعه اطلاعات مرجع شامل پلان‌ها، مدارک، رندرهای سه‌بعدی، کاتالوگ، ویدئو و تصاویر است.",
      assets: ["پلان", "مدارک پروژه", "رندر سه‌بعدی", "کاتالوگ", "ویدئو", "عکس"],
      images: ["assets/gold-projects/longbeach-1.webp"]
    },
    {
      id: "blue-residence",
      name: "Blue Residence",
      description: "معرفی Blue Residence با تصاویر بهینه‌شده برای وب؛ بسته مرجع پروژه شامل پلان، مدارک، رندر، کاتالوگ، ویدئو، عکس و تور ۳۶۰ درجه است.",
      assets: ["پلان", "مدارک پروژه", "رندر سه‌بعدی", "کاتالوگ", "ویدئو", "عکس", "تور ۳۶۰ درجه"],
      images: ["assets/gold-projects/blue-1.webp", "assets/gold-projects/blue-2.webp"]
    },
    {
      id: "royal-point",
      name: "Royal Point",
      description: "گالری Royal Point بر پایه محتوای مرجع ارائه‌شده؛ شامل پلان‌ها، مدارک عمومی، رندرهای سه‌بعدی، کاتالوگ، ویدئو و تصاویر پروژه.",
      assets: ["پلان", "مدارک پروژه", "رندر سه‌بعدی", "کاتالوگ", "ویدئو", "عکس"],
      images: ["assets/gold-projects/royal-1.webp", "assets/gold-projects/royal-2.webp"]
    }
  ];

  var dialog = document.getElementById("goldProjectsDialog");
  var dialogTitle = document.getElementById("gpDialogTitle");
  var dialogIndex = document.getElementById("gpDialogIndex");
  var dialogDescription = document.getElementById("gpDialogDescription");
  var dialogAssets = document.getElementById("gpDialogAssets");
  var imageCount = document.getElementById("gpImageCount");
  var mainImage = document.getElementById("gpMainImage");
  var thumbs = document.getElementById("gpThumbs");
  var closeButton = document.getElementById("gpDialogClose");
  var toast = document.getElementById("gpContactToast");
  var toastClose = document.getElementById("gpToastClose");
  var projectSection = document.getElementById("gold-projects");

  if (!dialog || !mainImage || !projectSection) return;

  var currentProject = 0;
  var currentImage = 0;
  var returnFocus = null;
  var toastTimer = 0;

  function faNumber(value) {
    return new Intl.NumberFormat("fa-IR", { useGrouping: false }).format(value);
  }

  function hideToast() {
    window.clearTimeout(toastTimer);
    toast.classList.remove("show");
    toast.setAttribute("aria-hidden", "true");
  }

  function showToast() {
    hideToast();
    toast.classList.add("show");
    toast.setAttribute("aria-hidden", "false");
    toastTimer = window.setTimeout(hideToast, 8500);
  }

  function showImage(index) {
    var project = projects[currentProject];
    currentImage = (index + project.images.length) % project.images.length;
    var number = String(currentImage + 1).padStart(2, "0");
    var total = String(project.images.length).padStart(2, "0");

    mainImage.innerHTML =
      '<img src="' + project.images[currentImage] + assetVersion + '" alt="تصویر ' + (currentImage + 1) + " پروژه " + project.name + '" draggable="false" decoding="async">' +
      '<span class="gp-image-caption">' + number + " / " + total + " · " + project.name + "</span>";

    window.requestAnimationFrame(function () {
      var image = mainImage.querySelector("img");
      if (image) image.classList.add("ready");
    });

    thumbs.querySelectorAll(".gp-thumb").forEach(function (button, imageIndex) {
      var active = imageIndex === currentImage;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function renderProject(index) {
    currentProject = (index + projects.length) % projects.length;
    currentImage = 0;
    var project = projects[currentProject];

    dialogTitle.textContent = project.name;
    dialogIndex.textContent = "PROJECT " + String(currentProject + 1).padStart(2, "0");
    dialogDescription.textContent = project.description;
    imageCount.textContent = faNumber(project.images.length);
    dialogAssets.innerHTML = project.assets.map(function (item) { return "<li>" + item + "</li>"; }).join("");
    thumbs.innerHTML = "";

    project.images.forEach(function (source, indexValue) {
      var button = document.createElement("button");
      button.className = "gp-thumb";
      button.type = "button";
      button.dataset.label = "VIEW " + String(indexValue + 1).padStart(2, "0");
      button.setAttribute("aria-label", "نمایش تصویر " + (indexValue + 1) + " پروژه " + project.name);
      button.setAttribute("aria-pressed", "false");
      button.innerHTML = '<img src="' + source + assetVersion + '" alt="" draggable="false" loading="lazy" decoding="async">';
      button.addEventListener("click", function () { showImage(indexValue); });
      thumbs.appendChild(button);
    });

    showImage(0);
  }

  function openProject(index, trigger) {
    returnFocus = trigger || document.activeElement;
    renderProject(index);
    dialog.classList.add("open");
    dialog.setAttribute("aria-hidden", "false");
    projectSection.setAttribute("aria-hidden", "true");
    document.body.classList.add("gp-modal-open");
    closeButton.focus();
  }

  function closeProject() {
    dialog.classList.remove("open");
    dialog.setAttribute("aria-hidden", "true");
    projectSection.removeAttribute("aria-hidden");
    document.body.classList.remove("gp-modal-open");
    hideToast();
    if (returnFocus) returnFocus.focus();
  }

  function shiftProject(delta) {
    renderProject(currentProject + delta);
  }

  document.querySelectorAll("[data-gp-project]").forEach(function (button) {
    var index = projects.findIndex(function (project) { return project.id === button.dataset.gpProject; });
    if (index >= 0) button.addEventListener("click", function () { openProject(index, button); });
  });

  closeButton.addEventListener("click", closeProject);
  document.getElementById("gpPrevious").addEventListener("click", function () { shiftProject(-1); });
  document.getElementById("gpNext").addEventListener("click", function () { shiftProject(1); });
  mainImage.addEventListener("click", showToast);
  toastClose.addEventListener("click", hideToast);

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) closeProject();
  });

  document.addEventListener("keydown", function (event) {
    if (!dialog.classList.contains("open")) return;
    if (event.key === "Escape") closeProject();
    if (event.key === "ArrowLeft") shiftProject(-1);
    if (event.key === "ArrowRight") shiftProject(1);
    if (event.key !== "Tab") return;

    var focusable = Array.from(dialog.querySelectorAll("button, a[href]")).filter(function (element) { return !element.disabled; });
    if (!focusable.length) return;
    if (event.shiftKey && document.activeElement === focusable[0]) {
      event.preventDefault();
      focusable[focusable.length - 1].focus();
    } else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
      event.preventDefault();
      focusable[0].focus();
    }
  });

  dialog.addEventListener("contextmenu", function (event) {
    if (event.target.closest(".gp-dialog-gallery")) event.preventDefault();
  });
  dialog.addEventListener("dragstart", function (event) {
    if (event.target.closest(".gp-dialog-gallery")) event.preventDefault();
  });

  initWater();

  function initWater() {
    var canvas = document.getElementById("goldProjectsWater");
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    var vertex = "#version 300 es\nvoid main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.0-1.0,0.0,1.0);}";
    var fragment = "#version 300 es\nprecision highp float;out vec4 o;uniform vec2 u_res;uniform float u_time;#define TAU 6.28318530718\nfloat caustic(vec2 uv){float t=u_time*.2+19.;vec2 p=mod(uv*TAU,TAU)-250.;vec2 i=p;float c=1.,inten=.005;for(int n=0;n<5;n++){float tt=t*(1.-(3.5/float(n+1)));i=p+vec2(cos(tt-i.x)+sin(tt+i.y),sin(tt-i.y)+cos(tt+i.x));c+=1./length(vec2(p.x/(sin(i.x+tt)/inten),p.y/(cos(i.y+tt)/inten)));}c/=5.;c=1.17-pow(c,1.4);return pow(abs(c),8.);}\nvoid main(){vec2 uv=gl_FragCoord.xy/u_res;uv.x*=u_res.x/u_res.y;vec2 p=(gl_FragCoord.xy-.5*u_res)/u_res.y;float c=caustic(uv*1.45);vec3 deep=vec3(.027,.019,.010),shallow=vec3(.19,.09,.018);vec3 col=mix(deep,shallow,smoothstep(1.25,-.1,length(p)));col+=vec3(.92,.34,.03)*c;col+=vec3(1.,.76,.2)*pow(c,1.8)*.45;col*=.52+.7*smoothstep(1.45,.12,length(p));col=col/(col+.78);o=vec4(pow(max(col,0.),vec3(.88)),1.);}";

    function shader(type, source) {
      var compiled = gl.createShader(type);
      gl.shaderSource(compiled, source);
      gl.compileShader(compiled);
      if (!gl.getShaderParameter(compiled, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(compiled));
      return compiled;
    }

    try {
      var program = gl.createProgram();
      gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);

      var resolution = gl.getUniformLocation(program, "u_res");
      var time = gl.getUniformLocation(program, "u_time");
      var elapsed = 0;
      var last = performance.now();
      var frameId = 0;
      var visible = false;

      function resize() {
        var density = Math.min(window.devicePixelRatio || 1, 1.25);
        var width = Math.max(1, Math.floor(canvas.clientWidth * density));
        var height = Math.max(1, Math.floor(canvas.clientHeight * density));
        if (width !== canvas.width || height !== canvas.height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
      }

      function frame(now) {
        frameId = 0;
        if (!visible) return;
        elapsed += Math.min((now - last) / 1000, .05);
        last = now;
        resize();
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform1f(time, elapsed);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        frameId = window.requestAnimationFrame(frame);
      }

      var observer = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        last = performance.now();
        if (visible && !frameId) frameId = window.requestAnimationFrame(frame);
        if (!visible && frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }
      }, { threshold: .05 });

      observer.observe(projectSection);
      window.addEventListener("resize", resize, { passive: true });
      resize();
    } catch (error) {
      canvas.hidden = true;
    }
  }
})();
