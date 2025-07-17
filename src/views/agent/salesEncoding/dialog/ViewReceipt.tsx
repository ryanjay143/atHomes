import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ViewReceipt({ sales, dateFormatter, currencyFormatter }: any) {
  const receiptRef = useRef<HTMLDivElement>(null);
  // const [imgLoaded, setImgLoaded] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // const handlePrint = () => {
  //   if (!receiptRef.current) return;
  //   const printContents = receiptRef.current.innerHTML;

  //   const printStyles = `
  //     <style>
  //       body {
  //         font-size: 20px !important;
  //         font-family: Arial, sans-serif;
  //       }
  //       label, span, div {
  //         font-size: 40px !important;
  //       }
  //       img {
  //         max-width: 800px !important;
  //         max-height: 800px !important;
  //         display: block;
  //         margin: 16px auto;
  //         margin-top: 150px;
  //       }
  //     </style>
  //   `;

  //   const width = 800;
  //   const height = 600;
  //   const left = window.screenX + (window.outerWidth - width) / 2;
  //   const top = window.screenY + (window.outerHeight - height) / 2;
  //   const printWindow = window.open(
  //     '',
  //     '',
  //     `width=${width},height=${height},left=${left},top=${top}`
  //   );

  //   if (printWindow) {
  //     printWindow.document.write('<html><head><title>Print Receipt</title>');
  //     printWindow.document.write(printStyles);
  //     printWindow.document.write('</head><body >');
  //     printWindow.document.write(printContents);
  //     printWindow.document.write('</body></html>');
  //     printWindow.document.close();
  //     printWindow.focus();
  //     setTimeout(() => {
  //       printWindow.print();
  //       printWindow.close();
  //     }, 500);
  //   }
  // };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button className='h-8 w-8 font-medium text-sm rounded-md border border-primary'>
            <FontAwesomeIcon icon={faEye} />
          </Button>
        </DialogTrigger>
        <DialogContent className='md:w-[90%] h-full max-h-[700px] overflow-auto'>
          <DialogHeader>
            <DialogTitle className='text-start'>View Receipt</DialogTitle>
            <DialogDescription>
              <div ref={receiptRef} className="grid gap-4 py-6 text-start bg-white">
                <div className="grid grid-cols-4 md:grid-cols- items-center gap-4">
                  <Label htmlFor="category" className="text-gray-600 font-semibold">
                    Broker/Agent:
                  </Label>
                  <span className="col-span-3 text-center text-gray-800">{sales.agent.personal_info.first_name} {sales.agent.personal_info.middle_name} {sales.agent.personal_info.last_name} {sales.agent.personal_info?.extension_name}</span>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-gray-600 font-semibold">
                    Client name:
                  </Label>
                  <span className="col-span-3 text-center text-gray-800">{sales.client_name}</span>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-gray-600 font-semibold">
                    Category:
                  </Label>
                  <span className="col-span-3 text-center text-gray-800">{sales.category}</span>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-gray-600 font-semibold">
                    Date of Sale:
                  </Label>
                  <span className="col-span-3 text-center text-gray-800">{dateFormatter.format(new Date(sales.date_on_sale))}</span>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-gray-600 font-semibold">
                    Amount:
                  </Label>
                  <span className="col-span-3 text-center text-gray-800">{currencyFormatter.format(sales.amount)}</span>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-gray-600 font-semibold">
                    Location:
                  </Label>
                  <span className="col-span-3 text-center text-gray-800">{sales.location}</span>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="remarks" className="text-gray-600 font-semibold">
                    Remarks:
                  </Label>
                  <span className="col-span-3 text-center text-gray-800">{sales.remarks}</span>
                </div>
                <Label htmlFor="remarks" className="text-gray-600 text-start font-semibold">
                  Proof of Transaction:
                </Label>
                <div className='mt-3 flex justify-start'>
                  <img
                    src={`${import.meta.env.VITE_URL}/${sales.image}`}
                    alt={sales.image}
                    className='h-full object-cover md:rounded-sm md:w-24 md:h-24  rounded-sm cursor-pointer transition-transform duration-200 hover:scale-105 hover:ring-2 hover:ring-primary'
                    // onLoad={() => setImgLoaded(true)}
                    onClick={() => setPreviewOpen(true)}
                    title="Click to preview"
                  />
                  {/* Modal Preview */}
                  <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogContent className="md:w[90%] flex flex-col items-center">
                      <img
                        src={`${import.meta.env.VITE_URL}/${sales.image}`}
                        alt={sales.image}
                        className="md:max-w-[80vw] md:max-h-[80vh] md:rounded shadow-lg"
                      />
                      <DialogFooter>
                        <Button className="mt-4" onClick={() => setPreviewOpen(false)}>
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className='flex flex-row justify-end gap-2'>
              <DialogClose asChild>
                <Button className='bg-red-500 hover:bg-red-400 h-8'>Close</Button>
              </DialogClose>
              {/* <Button className='h-8' onClick={handlePrint} disabled={!imgLoaded}>
                <FontAwesomeIcon icon={faPrint} />
                <span>Print</span>
              </Button> */}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ViewReceipt;