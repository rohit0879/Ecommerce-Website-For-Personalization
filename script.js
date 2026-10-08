let cartCount = 0;


/* =========================================
   Salesforce Helper
========================================= */

function sendSalesforceEvent(eventData) {

    if (
        window.SalesforceInteractions &&
        typeof SalesforceInteractions.sendEvent === "function"
    ) {

        SalesforceInteractions.sendEvent(eventData);

        console.log(
            "Salesforce event sent:",
            eventData
        );

    } else {

        console.warn(
            "SalesforceInteractions is not available."
        );

    }
}


/* =========================================
   Identify Customer
========================================= */

function identifyCustomer() {

    const emailInput =
        document.getElementById("customerEmail");

    const email =
        emailInput.value.trim();

    const message =
        document.getElementById("customerMessage");


    if (!email) {

        message.textContent =
            "Please enter your email address.";

        return;
    }


    if (!email.includes("@")) {

        message.textContent =
            "Please enter a valid email.";

        return;
    }


    /*
     * Store email locally for this demo.
     */

    localStorage.setItem(
        "customerEmail",
        email
    );


    message.textContent =
        "Customer identified successfully.";


    console.log(
        "Customer Email:",
        email
    );


    /*
     * Send custom interaction.
     */

    sendSalesforceEvent({

        interaction: {

            name: "Customer Identity",

            attributes: {

                email: email

            }

        }

    });

}


/* =========================================
   Product View
========================================= */

function viewProduct(
    productId,
    productName,
    price
) {

    console.log(
        "Product viewed:",
        productName
    );


    sendSalesforceEvent({

        interaction: {

            name: "Product View",

            attributes: {

                productId: productId,

                productName: productName,

                price: price

            }

        }

    });


    alert(
        productName +
        " selected."
    );

}


/* =========================================
   Add To Cart
========================================= */

function addToCart(
    productId,
    productName,
    price
) {

    cartCount++;

    document.getElementById(
        "cartCount"
    ).textContent = cartCount;


    console.log(
        "Added to cart:",
        productName
    );


    sendSalesforceEvent({

        interaction: {

            name: "Add To Cart",

            attributes: {

                productId: productId,

                productName: productName,

                price: price,

                quantity: 1

            }

        }

    });


    alert(
        productName +
        " added to cart."
    );

}


/* =========================================
   Search
========================================= */

function searchProducts() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const searchTerm =
        searchInput.value.trim();


    if (!searchTerm) {

        alert(
            "Please enter a search term."
        );

        return;
    }


    console.log(
        "Search:",
        searchTerm
    );


    sendSalesforceEvent({

        interaction: {

            name: "Product Search",

            attributes: {

                searchTerm: searchTerm

            }

        }

    });


    const products =
        document.querySelectorAll(
            ".product-card"
        );


    products.forEach(
        function (product) {

            const productName =
                product.dataset.productName
                    .toLowerCase();

            if (
                productName.includes(
                    searchTerm.toLowerCase()
                )
            ) {

                product.style.display =
                    "block";

            } else {

                product.style.display =
                    "none";

            }

        }
    );

}


/* =========================================
   Page Load
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Data360 Store loaded."
        );


        const savedEmail =
            localStorage.getItem(
                "customerEmail"
            );


        if (savedEmail) {

            document.getElementById(
                "customerEmail"
            ).value = savedEmail;

        }

    }
);