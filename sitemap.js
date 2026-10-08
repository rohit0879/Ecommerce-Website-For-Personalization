(function () {

    "use strict";


    const SI =
        SalesforceInteractions;



    /* =========================================================
       RESOLVERS
    ========================================================= */


    /*
     * Find the product card associated with
     * the clicked element.
     */

    function getProductCard(element) {

        if (!element) {

            return null;

        }


        return element.closest(
            ".product-card"
        );

    }



    /*
     * Product ID
     */

    function getProductId(element) {

        const card =
            getProductCard(element);


        if (!card) {

            return null;

        }


        return card.dataset.productId;

    }



    /*
     * SKU
     */

    function getProductSku(element) {

        const card =
            getProductCard(element);


        if (!card) {

            return null;

        }


        return card.dataset.productSku;

    }



    /*
     * Product Name
     */

    function getProductName(element) {

        const card =
            getProductCard(element);


        if (!card) {

            return null;

        }


        return card.dataset.productName;

    }



    /*
     * Product Price
     */

    function getProductPrice(element) {

        const card =
            getProductCard(element);


        if (!card) {

            return null;

        }


        return Number(
            card.dataset.productPrice
        );

    }



    /*
     * Product Category
     */

    function getProductCategory(element) {

        const card =
            getProductCard(element);


        if (!card) {

            return null;

        }


        return card.dataset.productCategory;

    }



    /*
     * Product Brand
     */

    function getProductBrand(element) {

        const card =
            getProductCard(element);


        if (!card) {

            return null;

        }


        return card.dataset.productBrand;

    }



    /*
     * Catalog ID
     */

    function getCatalogId(element) {

        const card =
            getProductCard(element);


        if (!card) {

            return null;

        }


        return card.dataset.catalogId;

    }



    /*
     * Email
     */

    function getEmail() {

        const input =
            document.getElementById(
                "customerEmail"
            );


        if (
            input &&
            input.value
        ) {

            return input.value.trim();

        }


        return (
            localStorage.getItem(
                "customerEmail"
            ) || null
        );

    }



    /* =========================================================
       SITEMAP
    ========================================================= */

    const sitemap = {


        /* =====================================================
           GLOBAL
        ===================================================== */

        global: {


            /*
             * Attach known customer email to
             * outgoing events.
             */

            onActionEvent:
                function (event) {


                    const email =
                        getEmail();


                    if (email) {


                        event.user =
                            event.user || {};


                        event.user.attributes =
                            event.user.attributes || {};


                        event.user.attributes.email =
                            email;

                    }


                    return event;

                },


            /*
             * =================================================
             * LISTENERS
             * =================================================
             */

            listeners: [



                /* =============================================
                   IDENTITY
                ============================================= */

                SI.listener(
                    "click",
                    "#identifyCustomerBtn",
                    function () {


                        const email =
                            getEmail();


                        if (!email) {

                            return;

                        }


                        SI.sendEvent({

                            interaction: {

                                name:
                                    "Identity",

                                attributes: {

                                    email:
                                        email

                                }

                            }

                        });


                        console.log(
                            "Identity event:",
                            email
                        );

                    }
                ),



                /* =============================================
                   PRODUCT SEARCH
                ============================================= */

                SI.listener(
                    "click",
                    "#searchButton",
                    function () {


                        const searchInput =
                            document.getElementById(
                                "searchInput"
                            );


                        if (!searchInput) {

                            return;

                        }


                        const searchTerm =
                            searchInput.value.trim();


                        if (!searchTerm) {

                            return;

                        }


                        SI.sendEvent({

                            interaction: {

                                name:
                                    "Product Search",

                                attributes: {

                                    searchTerm:
                                        searchTerm

                                }

                            }

                        });


                        console.log(
                            "Product Search:",
                            searchTerm
                        );

                    }
                ),



                /* =============================================
                   PRODUCT VIEW
                ============================================= */

                SI.listener(
                    "click",
                    ".view-product-btn",
                    function (event) {


                        const productId =
                            getProductId(
                                event.target
                            );


                        const productName =
                            getProductName(
                                event.target
                            );


                        const productPrice =
                            getProductPrice(
                                event.target
                            );


                        const category =
                            getProductCategory(
                                event.target
                            );


                        const brand =
                            getProductBrand(
                                event.target
                            );


                        const sku =
                            getProductSku(
                                event.target
                            );


                        const catalogId =
                            getCatalogId(
                                event.target
                            );


                        if (!productId) {

                            console.error(
                                "Product ID missing."
                            );

                            return;

                        }


                        /*
                         * Standard Salesforce
                         * Catalog View interaction.
                         */

                        SI.sendEvent({

                            interaction: {

                                name:
                                    SI
                                    .CatalogObjectInteractionName
                                    .ViewCatalogObject,


                                catalogObject: {

                                    type:
                                        "Product",


                                    id:
                                        productId,


                                    attributes: {

                                        name:
                                            productName,

                                        price:
                                            productPrice,

                                        sku:
                                            sku,

                                        brand:
                                            brand,

                                        category:
                                            category,

                                        catalogId:
                                            catalogId,

                                        currency:
                                            "INR"

                                    }

                                }

                            }

                        });


                        console.log(
                            "Product View sent:",
                            productId
                        );

                    }
                ),



                /* =============================================
                   ADD TO CART
                ============================================= */

                SI.listener(
                    "click",
                    ".cart-button",
                    function (event) {


                        const productId =
                            getProductId(
                                event.target
                            );


                        const productName =
                            getProductName(
                                event.target
                            );


                        const productPrice =
                            getProductPrice(
                                event.target
                            );


                        const category =
                            getProductCategory(
                                event.target
                            );


                        const brand =
                            getProductBrand(
                                event.target
                            );


                        const sku =
                            getProductSku(
                                event.target
                            );


                        const catalogId =
                            getCatalogId(
                                event.target
                            );


                        if (!productId) {

                            console.error(
                                "Product ID missing."
                            );

                            return;

                        }


                        /*
                         * Standard Salesforce
                         * AddToCart interaction.
                         */

                        SI.sendEvent({

                            interaction: {

                                name:
                                    SI
                                    .CartInteractionName
                                    .AddToCart,


                                lineItem: {

                                    catalogObjectType:
                                        "Product",


                                    catalogObjectId:
                                        productId,


                                    quantity:
                                        1,


                                    price:
                                        productPrice,


                                    currency:
                                        "INR",


                                    attributes: {

                                        name:
                                            productName,

                                        sku:
                                            sku,

                                        brand:
                                            brand,

                                        category:
                                            category,

                                        catalogId:
                                            catalogId

                                    }

                                }

                            }

                        });


                        console.log(
                            "Add To Cart sent:",
                            productId
                        );

                    }
                )

            ]

        },



        /* =====================================================
           PAGE TYPES
        ===================================================== */

        pageTypes: [



            /* =================================================
               HOME
            ================================================= */

            {

                name:
                    "Home",

                isMatch:
                    function () {


                        return (
                            window.location.pathname ===
                                "/" ||

                            window.location.pathname.endsWith(
                                "/index.html"
                            )

                        );

                    },

                interaction: {

                    name:
                        "Page View"

                }

            },



            /* =================================================
               PRODUCTS
            ================================================= */

            {

                name:
                    "Products",

                isMatch:
                    function () {


                        return !!document.querySelector(
                            "#products"
                        );

                    },

                interaction: {

                    name:
                        "Page View"

                }

            },



            /* =================================================
               SEARCH
            ================================================= */

            {

                name:
                    "Search",

                isMatch:
                    function () {


                        return !!document.querySelector(
                            "#searchInput"
                        );

                    },

                interaction: {

                    name:
                        "Page View"

                }

            }

        ],



        /* =====================================================
           DEFAULT
        ===================================================== */

        pageTypeDefault: {

            name:
                "Default",

            interaction: {

                name:
                    "Page View"

            }

        }

    };



    /* =========================================================
       INITIALIZE SDK
    ========================================================= */

    SI.init({

        /*
         * Keep this empty unless your org
         * requires a specific Data Space.
         */

    })


    .then(
        function () {


            console.log(
                "Salesforce Interactions SDK initialized."
            );


            return SI.initSitemap(
                sitemap
            );

        }
    )


    .then(
        function () {


            console.log(
                "Salesforce Data 360 Sitemap initialized successfully."
            );

        }
    )


    .catch(
        function (error) {


            console.error(
                "Sitemap initialization failed:",
                error
            );

        }
    );


})();
