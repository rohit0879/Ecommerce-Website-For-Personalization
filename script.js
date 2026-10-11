(function () {

  "use strict";

  const SI = SalesforceInteractions;

  /* =========================================================
     RESOLVERS
  ========================================================= */

  function getCard(el) {
    return el ? el.closest(".product-card") : null;
  }

  // Reads all product details from the clicked card's data attributes
  function getProduct(el) {
    const card = getCard(el);
    if (!card) return null;
    const d = card.dataset;
    return {
      id: d.productId,
      sku: d.productSku,
      name: d.productName,
      price: Number(d.productPrice),
      category: d.productCategory,
      brand: d.productBrand,
      catalogId: d.catalogId
    };
  }

  function getCustomer() {
    try {
      const c = JSON.parse(localStorage.getItem("customerDetails"));
      if (c) return c;
    } catch (e) { /* ignore */ }

    const input = document.getElementById("customerEmail");
    const email = (input && input.value.trim()) || localStorage.getItem("customerEmail");
    return email ? { email: email } : null;
  }

  // Customer details as Data 360 profile attributes
  function customerAttributes(c) {
    const a = { email: c.email };
    if (c.name) a.name = c.name;
    if (c.phone) a.phoneNumber = c.phone;
    if (c.address) a.address = c.address;
    if (c.city) a.city = c.city;
    if (c.state) a.state = c.state;
    if (c.pincode) a.postalCode = c.pincode;
    return a;
  }

  /* =========================================================
     SITEMAP
  ========================================================= */

  const sitemap = {

    global: {

      // Attach known customer details to every outgoing event
      onActionEvent: function (event) {
        const c = getCustomer();
        if (c && c.email) {
          event.user = event.user || {};
          event.user.attributes = Object.assign(event.user.attributes || {}, customerAttributes(c));
        }
        return event;
      },

      listeners: [

        /* ---------------- PRODUCT SEARCH ---------------- */
        SI.listener("click", "#searchButton", function () {
          const input = document.getElementById("searchInput");
          const term = input ? input.value.trim() : "";
          if (!term) return;

          SI.sendEvent({
            interaction: { name: "Product Search", attributes: { searchTerm: term } }
          });
          console.log("Product Search:", term);
        }),

        /* ---------------- PRODUCT VIEW ---------------- */
        SI.listener("click", ".view-product-btn", function (event) {
          const p = getProduct(event.target);
          if (!p || !p.id) { console.error("Product ID missing."); return; }

          SI.sendEvent({
            interaction: {
              name: SI.CatalogObjectInteractionName.ViewCatalogObject,
              catalogObject: {
                type: "Product",
                id: p.id,
                attributes: {
                  name: p.name, price: p.price, sku: p.sku, brand: p.brand,
                  category: p.category, catalogId: p.catalogId, currency: "INR"
                }
              }
            }
          });
          console.log("Product View sent:", p.id);
        }),

        /* ---------------- ADD TO CART ---------------- */
        SI.listener("click", ".cart-button", function (event) {
          const p = getProduct(event.target);
          if (!p || !p.id) { console.error("Product ID missing."); return; }

          SI.sendEvent({
            interaction: {
              name: SI.CartInteractionName.AddToCart,
              lineItem: {
                catalogObjectType: "Product",
                catalogObjectId: p.id,
                quantity: 1,
                price: p.price,
                currency: "INR",
                attributes: {
                  name: p.name, sku: p.sku, brand: p.brand,
                  category: p.category, catalogId: p.catalogId
                }
              }
            }
          });
          console.log("Add To Cart sent:", p.id);
        })

      ]
    },

    /* =======================================================
       PAGE TYPES
    ======================================================= */

    pageTypes: [
      {
        name: "Home",
        isMatch: function () {
          return window.location.pathname === "/" || window.location.pathname.endsWith("/index.html");
        },
        interaction: { name: "Page View" }
      },
      {
        name: "Products",
        isMatch: function () { return !!document.querySelector("#products"); },
        interaction: { name: "Page View" }
      },
      {
        name: "Search",
        isMatch: function () { return !!document.querySelector("#searchInput"); },
        interaction: { name: "Page View" }
      }
    ],

    pageTypeDefault: {
      name: "Default",
      interaction: { name: "Page View" }
    }
  };

  /* =========================================================
     CUSTOM STORE EVENTS (fired by script.js)
  ========================================================= */

  // Identity: sent only after the form is validated and saved
  document.addEventListener("store:identify", function (e) {
    const c = e.detail;
    if (!c || !c.email) return;

    SI.sendEvent({
      interaction: { name: "Identity", attributes: customerAttributes(c) }
    });
    console.log("Identity event:", c.email);
  });

  // Purchase: sent when the order is placed successfully
  document.addEventListener("store:order", function (e) {
    const o = e.detail;
    if (!o) return;

    SI.sendEvent({
      interaction: {
        name: SI.OrderInteractionName.Purchase,
        order: {
          id: o.id,
          totalValue: o.total,
          currency: o.currency,
          lineItems: o.items.map(function (i) {
            return {
              catalogObjectType: "Product",
              catalogObjectId: i.id,
              quantity: i.qty,
              price: i.price,
              currency: o.currency
            };
          })
        }
      }
    });
    console.log("Purchase sent:", o.id);
  });

  /* =========================================================
     INITIALIZE SDK
  ========================================================= */

  SI.init({})
    .then(function () {
      console.log("Salesforce Interactions SDK initialized.");
      return SI.initSitemap(sitemap);
    })
    .then(function () {
      console.log("Salesforce Data 360 Sitemap initialized successfully.");
    })
    .catch(function (error) {
      console.error("Sitemap initialization failed:", error);
    });

})();
