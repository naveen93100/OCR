
export const sendEnquiry = async (lead) => {

    const quantity = String(lead.requirement || "").match(/\d+(?:\.\d+)?/);
    const parsedQuantity = quantity ? Number(quantity[0]) : 0;

    const payload = {
        city: lead?.city || "",
        companyName: lead?.companyName || "",
        country: "India",
        createdBy: "015f7422-211f-4445-9434-e934727543c4",
        createdOn: new Date().toISOString(),
        customerId: "",
        customerName: lead?.customerName || "",
        email: lead.email?.trim() || "",
        enquiryType: "REI cards",
        mobileNumber: lead?.mobileNo || "",
        moduleType: [
            { moduleType: "Mono-PERC", monobi: "Monofacial", wattage: "530 Wp", type: "DCR" }
        ],
        notes: typeof lead.requirement === "object"
            ? JSON.stringify(lead?.requirement)
            : `requirement: ${lead?.requirement || ""}`,
        panelTypeId: [
            "282f079d-7516-4297-b021-25464a1d50cd"
        ],
        quantity: parsedQuantity,
        registrationType: "GAUTAM",
        salesPerson: "",
        source: "OCR",
        state: lead?.state || "",
        status: "Pending",
        unit: "KWp",
        cardImage: `https://ocr.gautamsolar.com/uploads/cards/${lead?.imagePath}`
    };

    const response = await fetch(
        "https://newenquiry.umanerp.com/api/enquiry/addEnquiry",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(payload)
        }
    );

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            `Enquiry API failed (${response.status}): ${JSON.stringify(responseData)}`
        );
    }

    return responseData;
};
