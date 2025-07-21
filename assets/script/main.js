    const PRODUCTS_API_URL = "https://script.google.com/macros/s/AKfycbyQ1eG5EynTHOpxJNFQBVJiAU5QTX880Y-jctfM1GS1UVkpOXOFZ_SEqI1GTAQ87UUPhA/exec";
    const ORDERS_API_URL = "https://script.google.com/macros/s/AKfycbw-pT4ThTSIDbAlBfe-r2Q6rIkW9LFYRqWhLqlC8ExvJEb9l0V_WIlR--9F4ze2_ycn/exec";
    const STATS_API_URL = "https://script.google.com/macros/s/AKfycbw-pT4ThTSIDbAlBfe-r2Q6rIkW9LFYRqWhLqlC8ExvJEb9l0V_WIlR--9F4ze2_ycn/exec?stats=true";
    const COUPONS_API_URL = "https://script.google.com/macros/s/AKfycbwzGdb3o1wNNDzuV4AP0Pog9wSlBhqPvznqapsnYOaKhBGRt2edyaN0iHA6bB6EzXTU/exec"; // ← Replace with your actual coupon API URL
    const HERO_SLIDER_API_URL = "https://script.google.com/macros/s/AKfycbx2bOYD5aMCYvgcKmmpfLVdQctrKsttXSYMNCjfUNJj1tyttY0CM7mVCNPnNRMJYUFf/exec"; // ← Replace with your actual hero slider API URL
    // تحميل المنتجات
    let allProducts = []; // Store all products for filtering
    
    function loadProducts() { 
  fetch(PRODUCTS_API_URL)
    .then(res => res.json())
    .then(data => {
      allProducts = data.filter(p => p.name && p.name.trim() !== ''); // Store all products
      displayProducts(allProducts);
    });
}

function displayProducts(productsToShow) {
  const tbody = document.querySelector("#productsTable tbody");
  tbody.innerHTML = '';

  productsToShow.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.price}</td>
      <td>${p.oldPrice}</td>
      <td>${p.category}</td>
      <td>${p.shortDesc}</td>
      <td>${p.available}</td>
      <td>
        <button class="btn btn-sm btn-warning me-1" onclick='editProduct(${JSON.stringify(p)})'>✎</button>
        <button class="btn btn-sm btn-danger" onclick='deleteProduct("${p.id}")'>🗑️</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

 function loadStats() {

  fetch(STATS_API_URL)
    .then(res => res.json())
    .then(data => {
      document.getElementById("ordersCount").textContent = data.orders;
      document.getElementById("totalRevenue").textContent = data.revenue + " د.أ";
    })
    .catch(() => {
      document.getElementById("ordersCount").textContent = "--";
      document.getElementById("totalRevenue").textContent = "--";
    });
}

function filterProducts() {
  const keyword = document.getElementById("searchProductsInput").value.toLowerCase();
  
  if (!keyword.trim()) {
    displayProducts(allProducts);
    return;
  }
  
  const filtered = allProducts.filter(product => {
    return product.name.toLowerCase().includes(keyword) ||
           product.category.toLowerCase().includes(keyword) ||
           product.shortDesc.toLowerCase().includes(keyword);
  });
  
  displayProducts(filtered);
}

    function editProduct(p) {
      document.getElementById('product-id').value = p.id || '';
      document.getElementById('product-name').value = p.name || '';
      document.getElementById('product-price').value = p.price || '';
      document.getElementById('product-oldPrice').value = p.oldPrice || '';
      document.getElementById('product-category').value = p.category || '';
      document.getElementById('product-shortDesc').value = p.shortDesc || '';
      document.getElementById('product-description').value = p.description || '';
      document.getElementById('product-images').value = p.images || '';
      document.getElementById('product-colors').value = p.colors || '';
      document.getElementById('product-available').value = p.available || '';
            document.getElementById('product-stock').value = p.stock || '';

    }

    document.getElementById("productForm").addEventListener("submit", e => {
  e.preventDefault();

  const idField = document.getElementById('product-id');
  const isEdit = !!idField.value;

  const data = {
    id: idField.value || Date.now(),
    name: document.getElementById('product-name').value,
    price: document.getElementById('product-price').value,
    oldPrice: document.getElementById('product-oldPrice').value,
    category: document.getElementById('product-category').value,
    shortDesc: document.getElementById('product-shortDesc').value,
    description: document.getElementById('product-description').value,
    colors: document.getElementById('product-colors').value,
    images: document.getElementById('product-images').value,
    available: document.getElementById('product-available').value,
    available: document.getElementById('product-stock').value
  };

  fetch(PRODUCTS_API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  }).then(() => {
    loadProducts();
    e.target.reset();
    idField.value = "";

    console.log(JSON.stringify(data));

    const messageEl = document.getElementById("product-message");
messageEl.textContent = isEdit
  ? "✅ تم تعديل المنتج بنجاح"
  : "✅ تم إضافة المنتج";
messageEl.className = "alert alert-success mt-3";
messageEl.style.display = "block";

setTimeout(() => {
  messageEl.style.display = "none";
}, 3000);
  }).catch(() => {
    const messageEl = document.getElementById("product-message");
    messageEl.classList.remove("alert-success");
    messageEl.classList.add("alert-danger");
    messageEl.innerHTML = "❌ فشل في الحفظ، تحقق من الاتصال";
    messageEl.style.display = "block";
  });
});



       // تحميل الطلبات
    let allOrders = []; // Store all orders for filtering
    
    function loadOrders() {
  fetch(ORDERS_API_URL)
    .then(res => res.json())
    .then(data => {
      allOrders = data.filter(o => o.name && o.name.trim() !== ''); // Store all orders
      displayOrders(allOrders);
    });
}

function displayOrders(ordersToShow) {
  const tbody = document.querySelector("#ordersTable tbody");
  tbody.innerHTML = '';

  ordersToShow.forEach(o => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.name}</td>
      <td>${o.phone}</td>
      <td>${o.email}</td>
      <td>${o.area}</td>
      <td>${o.address}</td>
      <td>${o.payment}</td>
      <td>${o.items}</td>
      <td>${o.deliveryFee}</td>
      <td>${o.discountAmount}</td>
      <td>${o.coupon}</td>
      <td>${o.total}</td>
      <td>${o.date}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary" onclick=\'printInvoice(${JSON.stringify(o)})\'>🧾 طباعة</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function filterOrders() {
  const keyword = document.getElementById("searchOrdersInput").value.toLowerCase();
  
  if (!keyword.trim()) {
    displayOrders(allOrders);
    return;
  }
  
  const filtered = allOrders.filter(order => {
    return order.name.toLowerCase().includes(keyword) ||
           order.phone.toLowerCase().includes(keyword) ||
           order.area.toLowerCase().includes(keyword) ||
           (order.date && order.date.toLowerCase().includes(keyword));
  });
  
  displayOrders(filtered);
}

function printInvoice(order) {
  const invoiceWindow = window.open("", "_blank");
  const logoUrl = "assets/img/logo.png"; // ← رابط الشعار

  const orderId = order.id || new Date(order.date || order.Timestamp).getTime();
  const orderDate = new Date(order.date || order.Timestamp).toLocaleString();

  let subtotal = 0;
  let itemsTable = "";

  const rows = order.items?.split("\n") || [];

  fetch(PRODUCTS_API_URL)
    .then(res => res.json())
    .then(products => {
      rows.forEach(line => {
        const match = line.match(/- \((\d+)\)\s+(.*?)\s+×\s+(\d+)/);
        if (!match) return;

        const productId = match[1];
        const productName = match[2].trim();
        const quantity = parseInt(match[3]);

        const product = products.find(p => String(p.id) === productId);
        const unitPrice = product ? parseFloat(product.price) : 0;
        const total = unitPrice * quantity;
        subtotal += total;

        itemsTable += `
          <tr>
            <td>${productName}</td>
            <td>${quantity}</td>
            <td>${unitPrice.toFixed(2)} د.أ</td>
            <td>${total.toFixed(2)} د.أ</td>
          </tr>`;
      });

      const isPercentage = (order.coupon || "").trim().endsWith("%");
      let discountDisplay = `${order.discountAmount} د.أ`;
      if (isPercentage) discountDisplay += ` (${order.coupon})`;

      const html = `
        <html dir="rtl" lang="ar">
        <head>
          <title>🧾 فاتورة الطلب</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h2 { text-align: center; margin-bottom: 20px; }
            .logo { display: block; max-width: 150px; margin: 0 auto 20px; }
            .box { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 6px; background: #f9f9f9; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            .label { font-weight: bold; }
            .total { font-size: 1.2em; color: green; }
            hr { margin: 30px 0; }
          </style>
        </head>
        <body>
          <img src="${logoUrl}" alt="Logo" class="logo">
          <h2>🧾 فاتورة الطلب</h2>

          <div class="box"><span class="label">رقم الطلب:</span> ${orderId}</div>
          <div class="box"><span class="label">تاريخ الطلب:</span> ${orderDate}</div>
          <div class="box"><span class="label">الاسم:</span> ${order.name}</div>
          <div class="box"><span class="label">الهاتف:</span> ${order.phone}</div>
          <div class="box"><span class="label">البريد الإلكتروني:</span> ${order.email || "---"}</div>
          <div class="box"><span class="label">المنطقة:</span> ${order.area}</div>
          <div class="box"><span class="label">العنوان:</span> ${order.address}</div>
          <div class="box"><span class="label">طريقة الدفع:</span> ${order.payment}</div>

          <div class="box">
            <span class="label">المنتجات:</span>
            <table>
              <thead>
                <tr>
                  <th>المنتج</th>
                  <th>الكمية</th>
                  <th>سعر الوحدة</th>
                  <th>المجموع</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTable}
              </tbody>
            </table>
          </div>

          <div class="box"><span class="label">المجموع الفرعي:</span> ${subtotal.toFixed(2)} د.أ</div>
          <div class="box"><span class="label">الخصم:</span> ${discountDisplay}</div>
          <div class="box"><span class="label">رسوم التوصيل:</span> ${order.deliveryFee} د.أ</div>
          <div class="box total"><span class="label">الإجمالي النهائي:</span> ${order.total} د.أ</div>

          <hr>
          <p style="text-align:center;">شكراً لتعاملك معنا 🌟</p>
        </body>
        </html>
      `;

      invoiceWindow.document.open();
      invoiceWindow.document.write(html);
      invoiceWindow.document.close();
      invoiceWindow.onload = () => invoiceWindow.print();
    });
}

function deleteProduct(productId) {
  if (!confirm("❗ هل أنت متأكد أنك تريد حذف هذا المنتج؟")) return;

 fetch(PRODUCTS_API_URL + "?_method=DELETE", {
  method: "POST",
  body: JSON.stringify({ id: productId })
})
  .then(res => res.json())
  .then(res => {
    if (res.success) {
      alert("✅ تم حذف المنتج");
      console.log({ id: productId });
      loadProducts();
    } else {
      alert("❌ فشل الحذف: " + res.message);
    }
  })
  .catch(() => alert("❌ خطأ أثناء الاتصال بالحذف"));
}

window.onload = () => {
  if (localStorage.getItem("dashboard-auth") === "true") {
    showDashboard();
    loadProducts();
    loadOrders();
    loadStats();
    loadCoupons(); // ✅ Load coupons on dashboard load
    loadHeroSlider(); // ✅ Load hero slider on dashboard load
    loadStock(); // ✅ Load stock data on dashboard load (integrated with products)

    // ✅ تحديث كل 10 ثوانٍ (10000 ميلي ثانية)
    setInterval(() => {
      loadProducts();
      loadOrders();
      loadStats();
      loadCoupons(); // ✅ Refresh coupons periodically
      loadHeroSlider(); // ✅ Refresh hero slider periodically
      loadStock(); // ✅ Refresh stock data periodically (integrated with products)
    }, 10000);
  }
};

    const cloudName = "dezvuqqrl"; // استبدله باسم حسابك في Cloudinary
const uploadPreset = "unsigned_preset"; // استبدله بـ unsigned preset من Cloudinary

document.getElementById('product-image-file').addEventListener('change', async function () {
  const files = this.files;
  const status = document.getElementById('upload-status');
  const imageLinks = [];

  status.textContent = '📤 جاري رفع الصور...';

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.secure_url) {
        imageLinks.push(data.secure_url);
      } else {
        alert("❌ فشل رفع صورة: " + file.name);
      }
    } catch (err) {
      alert("⚠️ خطأ في رفع الصورة: " + err.message);
    }
  }

  document.getElementById('product-images').value = imageLinks.join(", ");
  status.textContent = `✅ تم رفع ${imageLinks.length} صورة`;
});

// ==================== COUPON MANAGEMENT FUNCTIONS ====================

// Load coupons from Google Sheets
function loadCoupons() {
  fetch(COUPONS_API_URL)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#couponsTable tbody");
      tbody.innerHTML = '';

      if (Array.isArray(data)) {
        data.forEach(coupon => {
          const tr = document.createElement("tr");
          const isActive = coupon.Active === true || coupon.Active === 'TRUE' || coupon.Active === 'true';
          const expiryDate = coupon.ExpiryDate ? new Date(coupon.ExpiryDate).toLocaleDateString() : 'غير محدد';
          const createdDate = coupon.CreatedDate ? new Date(coupon.CreatedDate).toLocaleDateString() : 'غير محدد';
          
          tr.innerHTML = `
            <td>${coupon.Code}</td>
            <td>${coupon.Discount}%</td>
            <td>${expiryDate}</td>
            <td>${isActive ? '<span class="badge bg-success">نشط</span>' : '<span class="badge bg-secondary">غير نشط</span>'}</td>
            <td>${createdDate}</td>
            <td>
              <button class="btn btn-sm btn-warning me-1" onclick='editCoupon(${JSON.stringify(coupon)})'>✎</button>
              <button class="btn btn-sm btn-danger" onclick='deleteCoupon("${coupon.Code}")'>🗑️</button>
            </td>`;
          tbody.appendChild(tr);
        });
      }
    })
    .catch(error => {
      console.error('Error loading coupons:', error);
      const tbody = document.querySelector("#couponsTable tbody");
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">خطأ في تحميل الكوبونات</td></tr>';
    });
}

// Edit coupon - populate form with coupon data
function editCoupon(coupon) {
  document.getElementById('coupon-original-code').value = coupon.Code || '';
  document.getElementById('coupon-code').value = coupon.Code || '';
  document.getElementById('coupon-discount').value = coupon.Discount || '';
  
  // Handle expiry date
  if (coupon.ExpiryDate) {
    const date = new Date(coupon.ExpiryDate);
    if (!isNaN(date.getTime())) {
      document.getElementById('coupon-expiry').value = date.toISOString().split('T')[0];
    }
  }
  
  // Handle active status
  const isActive = coupon.Active === true || coupon.Active === 'TRUE' || coupon.Active === 'true';
  document.getElementById('coupon-active').value = isActive ? 'true' : 'false';
}

// Delete coupon
function deleteCoupon(couponCode) {
  if (!confirm(`❗ هل أنت متأكد أنك تريد حذف الكوبون "${couponCode}"؟`)) return;

  fetch(COUPONS_API_URL + "?_method=DELETE", {
    method: "POST",
    body: JSON.stringify({ code: couponCode })
  })
  .then(res => res.json())
  .then(res => {
    if (res.success) {
      alert("✅ تم حذف الكوبون");
      loadCoupons();
    } else {
      alert("❌ فشل الحذف: " + (res.error || res.message));
    }
  })
  .catch(error => {
    console.error('Error deleting coupon:', error);
    alert("❌ خطأ أثناء الاتصال بالحذف");
  });
}

// Handle coupon form submission
document.getElementById("couponForm").addEventListener("submit", e => {
  e.preventDefault();

  const originalCode = document.getElementById('coupon-original-code').value;
  const code = document.getElementById('coupon-code').value.trim().toUpperCase();
  const discount = parseFloat(document.getElementById('coupon-discount').value);
  const expiryDate = document.getElementById('coupon-expiry').value;
  const active = document.getElementById('coupon-active').value === 'true';

  // Validation
  if (!code) {
    alert('❌ يرجى إدخال كود الكوبون');
    return;
  }

  if (!discount || discount < 1 || discount > 100) {
    alert('❌ يرجى إدخال نسبة خصم صحيحة (1-100)');
    return;
  }

  const isEdit = !!originalCode;
  const data = {
    code: code,
    discount: discount,
    expiryDate: expiryDate || '',
    active: active
  };

  fetch(COUPONS_API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  })
  .then(res => res.json())
  .then(res => {
    if (res.success) {
      loadCoupons();
      e.target.reset();
      document.getElementById('coupon-original-code').value = "";

      const messageEl = document.getElementById("coupon-message");
      messageEl.textContent = isEdit
        ? "✅ تم تعديل الكوبون بنجاح"
        : "✅ تم إضافة الكوبون";
      messageEl.className = "alert alert-success mt-3";
      messageEl.style.display = "block";

      setTimeout(() => {
        messageEl.style.display = "none";
      }, 3000);
    } else {
      const messageEl = document.getElementById("coupon-message");
      messageEl.classList.remove("alert-success");
      messageEl.classList.add("alert-danger");
      messageEl.textContent = "❌ فشل في الحفظ: " + (res.error || res.message);
      messageEl.style.display = "block";
    }
  })
  .catch(error => {
    console.error('Error saving coupon:', error);
    const messageEl = document.getElementById("coupon-message");
    messageEl.classList.remove("alert-success");
    messageEl.classList.add("alert-danger");
    messageEl.textContent = "❌ فشل في الحفظ، تحقق من الاتصال";
    messageEl.style.display = "block";
  });
});



// ==================== HERO SLIDER MANAGEMENT FUNCTIONS ====================

// Load hero slider images from Google Sheets
function loadHeroSlider() {
  fetch(HERO_SLIDER_API_URL)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#heroSliderTable tbody");
      tbody.innerHTML = '';

      if (Array.isArray(data)) {
        data.sort((a, b) => (a.Order || 0) - (b.Order || 0)); // Sort by order
        
        data.forEach(slide => {
          const tr = document.createElement("tr");
          const isActive = slide.Active === true || slide.Active === 'TRUE' || slide.Active === 'true';
          
          tr.innerHTML = `
            <td>${slide.Title || ''}</td>
            <td>${slide.Subtitle || ''}</td>
            <td>
              ${slide.ImageURL ? `<img src="${slide.ImageURL}" style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;">` : 'لا توجد صورة'}
            </td>
            <td>${isActive ? '<span class="badge bg-success">نشط</span>' : '<span class="badge bg-secondary">غير نشط</span>'}</td>
            <td>${slide.Order || 0}</td>
            <td>
              <button class="btn btn-sm btn-warning me-1" onclick='editSlide(${JSON.stringify(slide)})'>✎</button>
              <button class="btn btn-sm btn-danger" onclick='deleteSlide("${slide.ID}")'>🗑️</button>
            </td>`;
          tbody.appendChild(tr);
        });
      }
    })
    .catch(error => {
      console.error('Error loading hero slider:', error);
      const tbody = document.querySelector("#heroSliderTable tbody");
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">خطأ في تحميل صور البانر</td></tr>';
    });
}

// Edit slide - populate form with slide data
function editSlide(slide) {
  document.getElementById('slide-id').value = slide.ID || '';
  document.getElementById('slide-title').value = slide.Title || '';
  document.getElementById('slide-subtitle').value = slide.Subtitle || '';
  document.getElementById('slide-image-url').value = slide.ImageURL || '';
  document.getElementById('slide-order').value = slide.Order || 0;
  
  // Handle active status
  const isActive = slide.Active === true || slide.Active === 'TRUE' || slide.Active === 'true';
  document.getElementById('slide-active').value = isActive ? 'true' : 'false';
}

// Delete slide
function deleteSlide(slideId) {
  if (!confirm(`❗ هل أنت متأكد أنك تريد حذف هذه الصورة؟`)) return;

  fetch(HERO_SLIDER_API_URL + "?_method=DELETE", {
    method: "POST",
    body: JSON.stringify({ id: slideId })
  })
  .then(res => res.json())
  .then(res => {
    if (res.success) {
      alert("✅ تم حذف الصورة");
      loadHeroSlider();
    } else {
      alert("❌ فشل الحذف: " + (res.error || res.message));
    }
  })
  .catch(error => {
    console.error('Error deleting slide:', error);
    alert("❌ خطأ أثناء الاتصال بالحذف");
  });
}

// Handle hero slider form submission
document.getElementById("heroSliderForm").addEventListener("submit", e => {
  e.preventDefault();

  const id = document.getElementById('slide-id').value;
  const title = document.getElementById('slide-title').value.trim();
  const subtitle = document.getElementById('slide-subtitle').value.trim();
  const imageURL = document.getElementById('slide-image-url').value.trim();
  const active = document.getElementById('slide-active').value === 'true';
  const order = parseInt(document.getElementById('slide-order').value) || 0;

  // Validation
  if (!title) {
    alert('❌ يرجى إدخال العنوان الرئيسي');
    return;
  }

  if (!imageURL) {
    alert('❌ يرجى رفع صورة للبانر');
    return;
  }

  const isEdit = !!id;
  const data = {
    id: id || undefined,
    title: title,
    subtitle: subtitle,
    imageURL: imageURL,
    active: active,
    order: order
  };

  fetch(HERO_SLIDER_API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  })
  .then(res => res.json())
  .then(res => {
    if (res.success) {
      loadHeroSlider();
      e.target.reset();
      document.getElementById('slide-id').value = "";
      document.getElementById('slide-image-url').value = "";

      const messageEl = document.getElementById("slide-message");
      messageEl.textContent = isEdit
        ? "✅ تم تعديل صورة البانر بنجاح"
        : "✅ تم إضافة صورة البانر";
      messageEl.className = "alert alert-success mt-3";
      messageEl.style.display = "block";

      setTimeout(() => {
        messageEl.style.display = "none";
      }, 3000);
    } else {
      const messageEl = document.getElementById("slide-message");
      messageEl.classList.remove("alert-success");
      messageEl.classList.add("alert-danger");
      messageEl.textContent = "❌ فشل في الحفظ: " + (res.error || res.message);
      messageEl.style.display = "block";
    }
  })
  .catch(error => {
    console.error('Error saving slide:', error);
    const messageEl = document.getElementById("slide-message");
    messageEl.classList.remove("alert-success");
    messageEl.classList.add("alert-danger");
    messageEl.textContent = "❌ فشل في الحفظ، تحقق من الاتصال";
    messageEl.style.display = "block";
  });
});

// Handle slide image upload to Cloudinary
document.getElementById('slide-image-file').addEventListener('change', async function () {
  const file = this.files[0];
  if (!file) return;

  const status = document.getElementById('slide-upload-status');
  status.textContent = '📤 جاري رفع الصورة...';

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (data.secure_url) {
      document.getElementById('slide-image-url').value = data.secure_url;
      status.textContent = '✅ تم رفع الصورة بنجاح';
    } else {
      alert("❌ فشل رفع الصورة");
      status.textContent = '❌ فشل رفع الصورة';
    }
  } catch (err) {
    alert("⚠️ خطأ في رفع الصورة: " + err.message);
    status.textContent = '❌ خطأ في رفع الصورة';
  }
});


// ==================== STOCK MANAGEMENT FUNCTIONS (Integrated with Products API) ====================

// Load stock information from Products API
let allStockData = []; // Store all stock data for filtering

function loadStock() {
  fetch(PRODUCTS_API_URL)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        allStockData = data.map(product => ({
          id: product.id,
          name: product.name,
          stock: parseInt(product.stock) || 0
        }));
        displayStock(allStockData);
        updateStockStats(allStockData);
        populateProductSelect(allStockData);
      }
    })
    .catch(error => {
      console.error('Error loading stock:', error);
      const tbody = document.querySelector("#stockTable tbody");
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">خطأ في تحميل بيانات المخزون</td></tr>';
      }
    });
}

function displayStock(stockData) {
  const tbody = document.querySelector("#stockTable tbody");
  if (!tbody) return;
  
  tbody.innerHTML = '';

  stockData.forEach(item => {
    const stock = parseInt(item.stock) || 0;
    let statusBadge, statusText;
    
    if (stock === 0) {
      statusBadge = '<span class="badge bg-danger">نفد المخزون</span>';
      statusText = 'out-of-stock';
    } else if (stock < 10) {
      statusBadge = '<span class="badge bg-warning">مخزون منخفض</span>';
      statusText = 'low-stock';
    } else {
      statusBadge = '<span class="badge bg-success">متوفر</span>';
      statusText = 'in-stock';
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name || 'منتج غير معروف'}</td>
      <td class="fw-bold">${stock}</td>
      <td>${statusBadge}</td>
      <td>
        <div class="input-group input-group-sm">
          <input type="number" class="form-control" id="stock-input-${item.id}" min="0" value="${stock}">
          <button class="btn btn-outline-primary" onclick="updateSingleStock('${item.id}', 'set')">تحديث</button>
        </div>
      </td>
      <td>
        <button class="btn btn-sm btn-success me-1" onclick="updateSingleStock('${item.id}', 'add', 10)">+10</button>
        <button class="btn btn-sm btn-warning me-1" onclick="updateSingleStock('${item.id}', 'subtract', 1)">-1</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function updateStockStats(stockData) {
  let inStock = 0, outOfStock = 0, lowStock = 0;
  
  stockData.forEach(item => {
    const stock = parseInt(item.stock) || 0;
    if (stock === 0) {
      outOfStock++;
    } else if (stock < 10) {
      lowStock++;
    } else {
      inStock++;
    }
  });
  
  const inStockEl = document.getElementById('in-stock-count');
  const outOfStockEl = document.getElementById('out-of-stock-count');
  const lowStockEl = document.getElementById('low-stock-count');
  
  if (inStockEl) inStockEl.textContent = inStock;
  if (outOfStockEl) outOfStockEl.textContent = outOfStock;
  if (lowStockEl) lowStockEl.textContent = lowStock;
}

function populateProductSelect(stockData) {
  const select = document.getElementById('quick-product-select');
  if (!select) return;
  
  select.innerHTML = '<option value="">اختر منتج...</option>';
  
  stockData.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = `${item.name} (${item.stock || 0})`;
    select.appendChild(option);
  });
}

function filterStock() {
  const searchInput = document.getElementById("searchStockInput");
  if (!searchInput) return;
  
  const keyword = searchInput.value.toLowerCase();
  
  if (!keyword.trim()) {
    displayStock(allStockData);
    return;
  }
  
  const filtered = allStockData.filter(item => {
    return item.name.toLowerCase().includes(keyword);
  });
  
  displayStock(filtered);
}

function updateSingleStock(productId, operation, quantity = null) {
  let stockValue;
  
  if (quantity !== null) {
    stockValue = quantity;
  } else {
    const input = document.getElementById(`stock-input-${productId}`);
    if (!input) return;
    stockValue = parseInt(input.value) || 0;
  }
  
  const data = {
    id: productId,
    stock: stockValue,
    operation: operation
  };
  
  fetch(PRODUCTS_API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  })
  .then(res => res.json())
  .then(res => {
    if (res.success) {
      loadStock(); // Reload stock data
      showStockMessage(`✅ تم تحديث المخزون بنجاح`);
    } else {
      showStockMessage(`❌ فشل في التحديث: ${res.error || res.message}`, 'danger');
    }
  })
  .catch(error => {
    console.error('Error updating stock:', error);
    showStockMessage('❌ خطأ في الاتصال', 'danger');
  });
}

function showStockMessage(message, type = 'success') {
  const messageEl = document.getElementById("stock-message");
  if (!messageEl) return;
  
  messageEl.className = `alert alert-${type} mt-3`;
  messageEl.textContent = message;
  messageEl.style.display = "block";
  
  setTimeout(() => {
    messageEl.style.display = "none";
  }, 3000);
}

// Handle quick stock form submission
const quickStockForm = document.getElementById("quickStockForm");
if (quickStockForm) {
  quickStockForm.addEventListener("submit", e => {
    e.preventDefault();

    const productId = document.getElementById('quick-product-select').value;
    const operation = document.getElementById('stock-operation').value;
    const quantity = parseInt(document.getElementById('stock-quantity').value);

    if (!productId) {
      alert('❌ يرجى اختيار منتج');
      return;
    }

    if (isNaN(quantity) || quantity < 0) {
      alert('❌ يرجى إدخال كمية صحيحة');
      return;
    }

    updateSingleStock(productId, operation, quantity);
    
    // Reset form
    e.target.reset();
  });
}

