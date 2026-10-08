document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           CART
        ===================================================== */

        let cartCount = 0;


        const cartCountElement =
            document.getElementById(
                "cartCount"
            );


        /* =====================================================
           CUSTOMER EMAIL
        ===================================================== */

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


        const savedEmail =
            localStorage.getItem(
                "customerEmail"
            );


        if (savedEmail) {

            emailInput.value =
                savedEmail;

        }


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


                if (!email.includes("@")) {

                    customerMessage.textContent =
                        "Please enter a valid email.";

                    return;

                }


                localStorage.setItem(
                    "customerEmail",
                    email
                );


                customerMessage.textContent =
                    "Customer identified successfully.";

            }
        );



        /* =====================================================
           PRODUCTS
        ===================================================== */

        const productCards =
            document.querySelectorAll(
                ".product-card"
            );


        productCards.forEach(
            function (card) {


                /* =============================================
                   VIEW PRODUCT
                ============================================= */

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
                            "Viewing " +
                            productName
                        );

                    }
                );



                /* =============================================
                   ADD TO CART
                ============================================= */

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



        /* =====================================================
           SEARCH
        ===================================================== */

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


            productCards.forEach(
                function (card) {


                    const name =
                        card.dataset
                            .productName
                            .toLowerCase();


                    const sku =
                        card.dataset
                            .productSku
                            .toLowerCase();


                    const category =
                        card.dataset
                            .productCategory
                            .toLowerCase();


                    const matches =
                        name.includes(
                            searchTerm
                        ) ||

                        sku.includes(
                            searchTerm
                        ) ||

                        category.includes(
                            searchTerm
                        );


                    card.style.display =
                        matches
                            ? ""
                            : "none";

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
