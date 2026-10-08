(function () {

    "use strict";


    /*
     * ==========================================================
     * SALESFORCE INTERACTIONS SDK
     * ==========================================================
     */

    const SI =
        SalesforceInteractions;


    /*
     * ==========================================================
     * RESOLVERS / HELPER FUNCTIONS
     * ==========================================================
     */


    /*
     * Get customer email
     */

    function getCustomerEmail() {

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


    /*
     * Get product card
     */

    function getProductCard(
        element
    ) {

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

    function getProductId(
        element
    ) {

        const card =
            getProductCard(
                element
            );


        if (!card) {

            return null;

        }


        return card.dataset.productId;

    }


    /*
     * Product Name
     */

    function getProductName(
        element
    ) {

        const card =
            getProductCard(
                element
            );


        if (!card) {

            return null;

        }


        return card.dataset.productName;

    }


    /*
     * Product Price
     */

    function getProductPrice(
        element
    ) {

        const card =
            getProductCard(
                element
            );


        if (!card) {

            return null;

        }


        const price =
            card.dataset.productPrice;


        return price
            ? Number(price)
            : null;

    }


    /*
     * Product Category
     */

    function getProductCategory(
        element
    ) {

        const card =
            getProductCard(
                element
            );


        if (!card) {

            return null;

        }


        return card.dataset.productCategory;

    }


    /*
     * ==========================================================
     * SITEMAP
     * ==========================================================
     */

    const sitemap = {


        /*
         * ======================================================
         * GLOBAL
         * ======================================================
         */

        global: {


            /*
             * Capture email on outgoing events
             */

            onActionEvent:
                function (event) {


                    const email =
                        getCustomerEmail();


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
             * ==================================================
             * LISTENERS
             * ==================================================
             */

            listeners: [


                /*
                 * ==============================================
                 * IDENTITY / EMAIL
                 * ==============================================
                 */

                SI.listener(
                    "click",
                    "#identifyCustomerBtn",
                    function () {


                        const email =
                            getCustomerEmail();


                        if (!email) {

                            return;

                        }


                        /*
                         * Send Identity event
                         */

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
                            "Identity event sent:",
                            email
                        );

                    }
                ),


                /*
                 * ==============================================
                 * PRODUCT SEARCH
                 * ==============================================
                 */

                SI.listener(
                    "click",
                    "#searchButton",
                    function () {


                        const input =
                            document.getElementById(
                                "searchInput"
                            );


                        if (!input) {

                            return;

                        }


                        const searchTerm =
                            input.value.trim();


                        if (!searchTerm) {

                            return;

                        }


                        /*
                         * Custom Search event
                         */

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
                            "Search event sent:",
                            searchTerm
                        );

                    }
                ),


                /*
                 * ==============================================
                 * ADD TO CART
                 * ==============================================
                 */

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


                        const productCategory =
                            getProductCategory(
                                event.target
                            );


                        if (!productId) {

                            console.warn(
                                "Product ID not found."
                            );

                            return;

                        }


                        /*
                         * Standard Salesforce
                         * Add To Cart interaction
                         */

                        SI.sendEvent({

                            interaction: {

                                name:
                                    SI.CartInteractionName
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

                                        category:
                                            productCategory

                                    }

                                }

                            }

                        });


                        console.log(
                            "Add To Cart event sent:",
                            productId
                        );

                    }
                )

            ]

        },


        /*
         * ======================================================
         * PAGE TYPES
         * ======================================================
         */

        pageTypes: [


            /*
             * ==================================================
             * HOME
             * ==================================================
             */

            {

                name:
                    "Home",

                isMatch:
                    function () {

                        return (
                            window.location.pathname ===
                                "/" ||

                            window.location.pathname ===
                                "/index.html"
                        );

                    },

                interaction: {

                    name:
                        "Page View"

                }

            },


            /*
             * ==================================================
             * PRODUCTS
             * ==================================================
             */

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


            /*
             * ==================================================
             * PRODUCT DETAIL
             * ==================================================
             *
             * For the current demo, the product cards are
             * available on the Products page.
             *
             * Therefore we capture the first product as the
             * catalog object when this page type matches.
             *
             * Later we can create separate URLs:
             *
             * /products/P001
             * /products/P002
             *
             * ==================================================
             */

            {

                name:
                    "Product Detail",

                isMatch:
                    function () {


                        return (
                            window.location.pathname
                                .toLowerCase()
                                .includes(
                                    "/product/"
                                )
                        );

                    },

                interaction: {

                    name:
                        SI.CatalogObjectInteractionName
                            .ViewCatalogObject,


                    catalogObject: {

                        type:
                            "Product",


                        id:
                            function () {

                                const card =
                                    document.querySelector(
                                        ".product-card"
                                    );


                                if (!card) {

                                    return null;

                                }


                                return card.dataset
                                    .productId;

                            },


                        attributes: {

                            name:
                                function () {

                                    const card =
                                        document.querySelector(
                                            ".product-card"
                                        );


                                    if (!card) {

                                        return null;

                                    }


                                    return card.dataset
                                        .productName;

                                },


                            price:
                                function () {

                                    const card =
                                        document.querySelector(
                                            ".product-card"
                                        );


                                    if (!card) {

                                        return null;

                                    }


                                    return Number(
                                        card.dataset
                                            .productPrice
                                    );

                                },


                            category:
                                function () {

                                    const card =
                                        document.querySelector(
                                            ".product-card"
                                        );


                                    if (!card) {

                                        return null;

                                    }


                                    return card.dataset
                                        .productCategory;

                                }

                        }

                    }

                }

            },


            /*
             * ==================================================
             * SEARCH
             * ==================================================
             */

            {

                name:
                    "Search",

                isMatch:
                    function () {

                        return !!document.getElementById(
                            "searchInput"
                        );

                    },

                interaction: {

                    name:
                        "Page View"

                }

            }

        ],


        /*
         * ======================================================
         * DEFAULT
         * ======================================================
         */

        pageTypeDefault: {

            name:
                "Default",

            interaction: {

                name:
                    "Page View"

            }

        }

    };


    /*
     * ==========================================================
     * INITIALIZE SDK
     * ==========================================================
     */

    SI.init({

        /*
         * Leave dataspace unspecified unless
         * your Salesforce configuration requires
         * a specific dataspace.
         */

    })


    /*
     * ==========================================================
     * INITIALIZE SITEMAP
     * ==========================================================
     */

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
                "Salesforce Data 360 Sitemap initialized."
            );

        }
    )


    .catch(
        function (error) {

            console.error(
                "Salesforce Data 360 initialization error:",
                error
            );

        }
    );

})();
