 const PRODUCTS_API_URL = "https://script.google.com/macros/s/AKfycbyQ1eG5EynTHOpxJNFQBVJiAU5QTX880Y-jctfM1GS1UVkpOXOFZ_SEqI1GTAQ87UUPhA/exec";
    const ORDERS_API_URL = "https://script.google.com/macros/s/AKfycbw-pT4ThTSIDbAlBfe-r2Q6rIkW9LFYRqWhLqlC8ExvJEb9l0V_WIlR--9F4ze2_ycn/exec";
    const STATS_API_URL = "https://script.google.com/macros/s/AKfycbw-pT4ThTSIDbAlBfe-r2Q6rIkW9LFYRqWhLqlC8ExvJEb9l0V_WIlR--9F4ze2_ycn/exec?stats=true"; // ← ضع رابط Web App الصحيح
    // تحميل المنتجات
    function loadProducts() { 
  fetch(PRODUCTS_API_URL)
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector("#productsTable tbody");
      tbody.innerHTML = '';

      data
        .filter(p => p.name && p.name.trim() !== '') // ✅ تجاهل المنتجات بدون اسم
        .forEach(p => {
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
    });
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
    available: document.getElementById('product-available').value,
    colors: document.getElementById('product-colors').value,
    images: document.getElementById('product-images').value,
  };

  fetch(PRODUCTS_API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  }).then(() => {
    loadProducts();
    e.target.reset();
    idField.value = "";

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
    function loadOrders() {
      fetch(ORDERS_API_URL)
        .then(res => res.json())
        .then(data => {
          const tbody = document.querySelector("#ordersTable tbody");
          tbody.innerHTML = '';
        

          data.filter(p => p.name && p.name.trim() !== '').forEach(order => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${order.name}</td>
              <td>${order.phone}</td>
              <td>${order.email}</td>
              <td>${order.area}</td>
              <td>${order.address}</td>
              <td>${order.payment}</td>
              <td><pre>${order.items}</pre></td>
              <td>${order.deliveryFee}</td>
              <td>${order.discountAmount}</td>
              <td>${order.coupon}</td>
              <td>${order.total}</td>
              <td>${new Date(order.date || order.Timestamp).toLocaleString()}</td>
              <td>
  <button class="btn btn-sm btn-outline-secondary" onclick='printInvoice(${JSON.stringify(order)})'>🧾 طباعة</button>
</td>`;
            tbody.appendChild(tr);
          });
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

    function filterOrders() {
  const keyword = document.getElementById("searchOrdersInput").value.toLowerCase();
  const rows = document.querySelectorAll("#ordersTable tbody tr");

  rows.forEach(row => {
    const name = row.cells[0].textContent.toLowerCase();     // الاسم
    const date = row.cells[10].textContent.toLowerCase();    // التاريخ

    const match = name.includes(keyword) || date.includes(keyword);
    row.style.display = match ? "" : "none";
  });
}


function printInvoice(order) {
  const invoiceWindow = window.open('', '_blank');
  const logoUrl = "assets/img/logo.png"; // ← رابط الشعار

  const orderId = order.id || new Date(order.date || order.Timestamp).getTime();
  const orderDate = new Date(order.date || order.Timestamp).toLocaleString();

  let subtotal = 0;
  let itemsTable = '';

  const rows = order.items?.split('\n') || [];

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

      const isPercentage = (order.coupon || '').trim().endsWith('%');
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
          <div class="box"><span class="label">البريد الإلكتروني:</span> ${order.email || '---'}</div>
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
      loadProducts();
    } else {
      alert("❌ فشل الحذف: " + res.message);
    }
  })
  .catch(() => alert("❌ خطأ أثناء الاتصال بالحذف"));
}

    loadProducts();
    loadOrders();
    loadStats();
window.onload = () => {
  if (localStorage.getItem("dashboard-auth") === "true") {
    showDashboard();
    loadProducts();
    loadOrders();
    loadStats();

    // ✅ تحديث كل 10 ثوانٍ (10000 ميلي ثانية)
    setInterval(() => {
      loadProducts();
      loadOrders();
      loadStats();
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