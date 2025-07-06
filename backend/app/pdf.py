from io import BytesIO
from weasyprint import HTML

def generate_invoice_pdf(client, job, expenses):
    html = f"""
    <html>
    <head><meta charset='utf-8'><title>Invoice</title></head>
    <body>
        <h1>Invoice</h1>
        <h2>Client: {client.name}</h2>
        <p>Email: {client.email}<br>Phone: {client.phone or ''}</p>
        <h3>Job Details</h3>
        <ul>
            <li>Hours: {job.hours}</li>
            <li>Rate: ${job.rate:.2f}</li>
            <li>Notes: {job.notes or ''}</li>
        </ul>
        <h3>Expenses</h3>
        <table border='1' cellpadding='4' cellspacing='0'>
            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
            {''.join(f'<tr><td>{e.item_name}</td><td>{e.quantity}</td><td>${e.price:.2f}</td><td>${e.quantity * e.price:.2f}</td></tr>' for e in expenses)}
        </table>
        <h2>Total: ${job.hours * job.rate + sum(e.quantity * e.price for e in expenses):.2f}</h2>
    </body>
    </html>
    """
    pdf_io = BytesIO()
    HTML(string=html).write_pdf(pdf_io)
    pdf_io.seek(0)
    return pdf_io
