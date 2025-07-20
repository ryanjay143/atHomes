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
import { faEye, faFileInvoiceDollar, faUser, faMapMarkerAlt, faCalendarAlt, faMoneyBillWave, faFileImage, faCommentDots, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ViewReceipt({ sales, dateFormatter, currencyFormatter }: any) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button className="h-8 w-8 font-medium text-sm rounded-md border border-primary bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow hover:from-blue-600 hover:to-blue-800 transition-all duration-200">
            <FontAwesomeIcon icon={faEye} />
          </Button>
        </DialogTrigger>
        <DialogContent className="md:w-[95%] max-w-2xl h-full overflow-auto bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border border-blue-200">
          <DialogHeader>
            <DialogTitle className="text-start text-2xl font-bold text-blue-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-blue-500" />
              View Receipt
            </DialogTitle>
            <DialogDescription>
              <div
                ref={receiptRef}
                className="grid gap-6 py-6 text-start bg-white rounded-xl shadow-inner px-6"
              >
                {/* Broker/Agent */}
                <div className="flex items-center gap-3 border-b pb-3">
                  <FontAwesomeIcon icon={faUser} className="text-blue-400 text-lg" />
                  <Label className="text-gray-600 font-semibold">Broker/Agent:</Label>
                  <span className="ml-2 text-base text-gray-800 font-medium">
                    {sales.agent.personal_info.first_name}{' '}
                    {sales.agent.personal_info.middle_name}{' '}
                    {sales.agent.personal_info.last_name}{' '}
                    {sales.agent.personal_info?.extension_name}
                  </span>
                </div>
                {/* Client Name */}
                <div className="flex items-center gap-3 border-b pb-3">
                  <FontAwesomeIcon icon={faUser} className="text-blue-400 text-lg" />
                  <Label className="text-gray-600 font-semibold">Client Name:</Label>
                  <span className="ml-2 text-base text-gray-800 font-medium">
                    {sales.client_name}
                  </span>
                </div>
                {/* Category */}
                <div className="flex items-center gap-3 border-b pb-3">
                  <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-blue-400 text-lg" />
                  <Label className="text-gray-600 font-semibold">Category:</Label>
                  <span className="ml-2 text-base text-gray-800 font-medium">
                    {sales.category}
                  </span>
                </div>
                {/* Date of Sale */}
                <div className="flex items-center gap-3 border-b pb-3">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400 text-lg" />
                  <Label className="text-gray-600 font-semibold">Date of Sale:</Label>
                  <span className="ml-2 text-base text-gray-800 font-medium">
                    {dateFormatter.format(new Date(sales.date_on_sale))}
                  </span>
                </div>
                {/* Amount */}
                <div className="flex items-center gap-3 border-b pb-3">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500 text-lg" />
                  <Label className="text-gray-600 font-semibold">Amount:</Label>
                  <span className="ml-2 text-base text-green-700 font-bold">
                    {currencyFormatter.format(sales.amount)}
                  </span>
                </div>
                {/* Location */}
                <div className="flex items-center gap-3 border-b pb-3">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-400 text-lg" />
                  <Label className="text-gray-600 font-semibold">Location:</Label>
                  <span className="ml-2 text-base text-gray-800 font-medium">
                    {sales.location}
                  </span>
                </div>
                {/* Remarks */}
                <div className="flex items-center gap-3 border-b pb-3">
                  <FontAwesomeIcon icon={faCommentDots} className="text-indigo-400 text-lg" />
                  <Label className="text-gray-600 font-semibold">Remarks:</Label>
                  <span className="ml-2 text-base text-gray-800 font-medium">
                    {sales.remarks}
                  </span>
                </div>
                {/* Proof of Transaction */}
                <div className="flex flex-col gap-2 mt-2">
                  <Label className="text-gray-600 font-semibold flex items-center gap-2">
                    <FontAwesomeIcon icon={faFileImage} className="text-pink-400 text-lg" />
                    Proof of Transaction:
                  </Label>
                  <div className="flex justify-center">
                    <img
                      src={`${import.meta.env.VITE_URL}/${sales.image}`}
                      alt={sales.image}
                      className="object-cover rounded-lg border-2 border-blue-200 shadow-md max-w-xs max-h-60 cursor-pointer transition-transform duration-200 hover:scale-105 hover:ring-2 hover:ring-primary"
                      onClick={() => setPreviewOpen(true)}
                      title="Click to preview"
                    />
                  </div>
                  {/* Preview Dialog */}
                  <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogContent className="md:max-w-[80vw] flex flex-col items-center bg-white rounded-xl shadow-2xl">
                      <img
                        src={`${import.meta.env.VITE_URL}/${sales.image}`}
                        alt={sales.image}
                        className="max-w-[80vw] max-h-[80vh] rounded shadow-lg"
                      />
                      <DialogFooter>
                        <Button
                          className="mt-4 bg-red-500 hover:bg-red-400 text-white"
                          onClick={() => setPreviewOpen(false)}
                        >
                          <FontAwesomeIcon icon={faTimes} className="mr-1" />
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
            <div className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button className="bg-red-500 hover:bg-red-400 h-8 rounded shadow">
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ViewReceipt;