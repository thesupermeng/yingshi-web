import {Button} from '@material-tailwind/react';
import {useState} from 'react';
import PaymentModal from '@/components/payment/paymentModal';

export default function WebPage() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(x => !x);
  }

  // still in testing only..
  return <div>
    <Button onClick={handleOpen}>show modal</Button>
    <PaymentModal open={open} handler={handleOpen}/>
  </div>
}
