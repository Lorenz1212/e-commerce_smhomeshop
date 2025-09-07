import { KTIcon } from '@/helpers';
import { FC } from 'react';

interface Props {
  data: any;
}

const ViewCustomerDetails: FC<Props> = ({ data }) => {

  const { personal_info } = data;

  return (
    <>
      <div className="d-flex align-items-center mb-4">
        {/* Profile Image */}
        <div>
          <h5 className="mb-0">{personal_info.full_name}</h5>
          <small className="text-muted">Customer</small>
        </div>
      </div>

      {/* Personal Info */}
      <div className="row mb-2">
        <div className="col-sm-4 text-muted">Email</div>
        <div className="col-sm-8 fw-semibold">{personal_info.email}</div>
      </div>

      <div className="row mb-2">
        <div className="col-sm-4 text-muted">Contact No</div>
        <div className="col-sm-8 fw-semibold">{personal_info.phone}</div>
      </div>

      <div className="row mb-2">
        <div className="col-sm-4 text-muted">Birthdate</div>
        <div className="col-sm-8 fw-semibold">{personal_info.birth_date_format}</div>
      </div>

      <div className="row mb-2">
        <div className="col-sm-4 text-muted">Gender</div>
        <div className="col-sm-8 fw-semibold">{personal_info.gender === 'M' ? 'Male' : 'Female'}</div>
      </div>
    </>
  );
};

export { ViewCustomerDetails };


