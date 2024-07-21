import { add, subDays } from 'date-fns';

import { _mock } from './_mock';
import { _addressBooks } from './_others';

// ----------------------------------------------------------------------

export const QUATATION_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export const QUATATION_SERVICE_OPTIONS = [...Array(8)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.role(index),
  price: _mock.number.price(index),
}));

const ITEMS = [...Array(3)].map((__, index) => {
  const total = QUATATION_SERVICE_OPTIONS[index].price * _mock.number.nativeS(index);

  return {
    id: _mock.id(index),
    total,
    title: _mock.productName(index),
    description: _mock.sentence(index),
    price: QUATATION_SERVICE_OPTIONS[index].price,
    service: QUATATION_SERVICE_OPTIONS[index].name,
    quantity: _mock.number.nativeS(index),
  };
});

export const _quatations = [...Array(20)].map((_, index) => {
  const status =
    (index % 2 && 'pending') || (index % 3 && 'approved') || (index % 4 && 'rejected') || 'pending';

  return {
    customerName: _mock.name.findName(),
    nic: _mock.random.number().toString(),
    gender: _mock.random.arrayElement(['male', 'female']),
    customerAddress: _mock.address.streetAddress(),
    dob: _mock.date.past(),
    mobileNumber: _mock.phone.phoneNumber(),
    bankAccount: _mock.finance.amount(),
    loanAmount: _mock.finance.amount(),
    remarks: _mock.lorem.sentence(),
    insurancePolicy: _mock.lorem.word(),
    coverList: [_mock.lorem.word()],
    civilStatus: _mock.random.arrayElement(['married', 'unmarried']),
    loanPeriod: _mock.random.arrayElement(['1 year', '2 years', '3 years']),
    interestRate: _mock.finance.amount(),
    profession: _mock.name.jobTitle(),
    loanPurpose: _mock.lorem.sentence(),
    createDate: subDays(new Date(), index),
    status,
    reply: [],
  };
});
