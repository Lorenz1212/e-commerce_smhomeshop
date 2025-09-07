import { FC, useMemo } from "react";
import { WalkinOrderDetailsModel } from "../../core/_model";

interface Props {
  data: WalkinOrderDetailsModel | null;
}

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

const ViewReceipt: FC<Props> = ({ data }) => {
  const invoice = useMemo(() => data, [data]);

  if (!invoice) return <div>Loading invoice...</div>;

  return (
    <div className="container py-2 d-flex justify-content-center">
      <div className="p-5 rounded-4 shadow-lg w-100" style={{ maxWidth: "900px" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-5">
          <div>
            <h2 className="fw-bold mb-1">Invoice</h2>
            <p className="text-muted mb-0">Order No: {invoice.order_no}</p>
            <p className="text-muted">Queue: {invoice.queue_number ?? "—"}</p>
          </div>
          <div className="text-end">
            <p className="mb-1"><strong>Date:</strong> {invoice.order_date}</p>
            <p className="mb-1"><strong>Request Type:</strong> {invoice.request_type}</p>
              <span className={`badge bg-${invoice.status_format.color}`}>{invoice.status_format.title}</span>
          </div>
        </div>

        {/* Items */}
        <div className="table-responsive mb-4">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th className="text-center">Qty</th>
                <th className="text-end">Unit Price</th>
                <th className="text-end">Subtotal</th>
                <th>Add-ons</th>
              </tr>
            </thead>
            <tbody>
              {invoice.products?.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-end">{currency.format(item.unit_price)}</td>
                  <td className="text-end">{currency.format(item.subtotal)}</td>
                  <td>
                    {item.addons?.length ? (
                      <ul className="list-unstyled mb-0 small text-muted">
                        {item.addons.map((addon, i) => (
                          <li key={i}>
                            {addon.name} — {currency.format(addon.unit_price)} (
                            {currency.format(addon.subtotal)})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="d-flex justify-content-end">
          <div style={{ minWidth: "300px" }}>
            <div className="d-flex justify-content-between py-3 fs-5 fw-bold">
              <span>TOTAL</span>
              <span>{currency.format(invoice.total_amount)}</span>
            </div>
            <div className="d-flex justify-content-between border-bottom py-2">
              <span>VAT AMOUNT</span>
              <strong>{currency.format(invoice.tax_amount ?? 0)}</strong>
            </div>
            <div className="d-flex justify-content-between border-bottom py-2">
              <span>VATABLE SALES</span>
              <strong>{currency.format(invoice.subtotal)}</strong>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="text-center mt-5 text-muted small">
          <p className="mb-0">Thank you for your order!</p>
          <p className="mb-0">This is a system-generated invoice.</p>
        </div> */}
      </div>
    </div>
  );
};

export { ViewReceipt };
