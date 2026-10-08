document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Data360 Store loaded."
        );


        /*
         * ============================================
         * CART
         * ============================================
         */

        let cartCount = 0;


        const cartCountElement =
            document.getElementById(
                "cartCount"
            );


        /*
         * ============================================
         * CUSTOMER EMAIL
         * ============================================
         */

        const emailInput =
            document.getElementById(
                "customerEmail"
            );


        const identifyButton =
            document.getElementById(
                "identifyCustomerBtn"
            );


        const customerMessage =
            document.getElementById(
                "customerMessage"
            );


        /*
         * Restore previously entered email
         */

        const savedEmail =
            localStorage.getItem(
                "customerEmail"
            );


        if (savedEmail) {

            emailInput.value =
                savedEmail;

        }


        /*
         * Identify Customer
         */

        identifyButton.addEventListener(
            "click",
            function () {

                const email =
                    emailInput.value.trim();


                if (!email) {

                    customerMessage.textContent =
                        "Please enter your email.";

                    return;

                }


                if (
                    !email.includes("@")
                ) {

                    customerMessage.textContent =
                        "Please enter a valid email.";

                    return;

                }


                /*
                 * Store email locally.
                 */

                localStorage.setItem(
                    "customerEmail",
                    email
                );


                customerMessage.textContent =
                    "Customer identified successfully.";

            }
        );


        /*
         * ============================================
         * PRODUCT BUTTONS
         * ============================================
         */

        const productCards =
            document.querySelectorAll(
                ".product-card"
            );


        productCards.forEach(
            function (card) {


                /*
                 * ------------------------------
                 * View Product
                 * ------------------------------
                 */

                const viewButton =
                    card.querySelector(
                        ".view-product-btn"
                    );


                viewButton.addEventListener(
                    "click",
                    function () {

                        const productName =
                            card.dataset.productName;


                        alert(
                            "You selected: " +
                            productName
                        );

                    }
                );


                /*
                 * ------------------------------
                 * Add To Cart
                 * ------------------------------
                 */

                const cartButton =
                    card.querySelector(
                        ".cart-button"
                    );


                cartButton.addEventListener(
                    "click",
                    function () {

                        cartCount++;


                        cartCountElement.textContent =
                            cartCount;


                        const productName =
                            card.dataset.productName;


                        alert(
                            productName +
                            " added to cart."
                        );

                    }
                );

            }
        );


        /*
         * ============================================
         * SEARCH
         * ============================================
         */

        const searchInput =
            document.getElementById(
                "searchInput"
            );


        const searchButton =
            document.getElementById(
                "searchButton"
            );


        function performSearch() {

            const searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!searchTerm) {

                productCards.forEach(
                    function (card) {

                        card.style.display =
                            "";

                    }
                );

                return;

            }


            productCards.forEach(
                function (card) {

                    const productName =
                        card.dataset.productName
                            .toLowerCase();


                    const category =
                        card.dataset.productCategory
                            .toLowerCase();


                    if (
                        productName.includes(
                            searchTerm
                        ) ||
                        category.includes(
                            searchTerm
                        )
                    ) {

                        card.style.display =
                            "";

                    } else {

                        card.style.display =
                            "none";

                    }

                }
            );

        }


        searchButton.addEventListener(
            "click",
            performSearch
        );


        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    performSearch();

                }

            }
        );

    }
);
