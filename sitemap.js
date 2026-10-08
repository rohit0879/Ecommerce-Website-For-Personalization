(function () {

    "use strict";

    const sitemap = {

        global: {

            onActionEvent: function (event) {

                event.user = event.user || {};

                event.user.attributes =
                    event.user.attributes || {};

                const email =
                    localStorage.getItem(
                        "customerEmail"
                    );

                if (email) {

                    event.user.attributes.email =
                        email;

                }

                return event;
            }

        },


        pageTypes: [

            {
                name: "home",

                isMatch: function () {

                    return window.location.pathname === "/";

                },

                interaction: {

                    name: "Home Page View"

                }

            },


            {
                name: "products",

                isMatch: function () {

                    return window.location.hash === "#products";

                },

                interaction: {

                    name: "Products Page View"

                }

            }

        ]

    };


    SalesforceInteractions.init({

        consents: []

    }).then(function () {

        SalesforceInteractions.initSitemap(
            sitemap
        );

        console.log(
            "Data360 Sitemap initialized."
        );

    }).catch(function (error) {

        console.error(
            "Sitemap initialization error:",
            error
        );

    });

})();