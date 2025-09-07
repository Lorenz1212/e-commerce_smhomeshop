import { KTIcon } from '@/helpers';
import { FC } from 'react';

interface Props {
  data: any;
}

const ViewUserDetailsModal: FC<Props> = ({ data }) => {

  const { personal_info, user, modules, role_name } = data;

  return (
    <>
      <div className="d-flex align-items-center mb-4">
        {/* Profile Image */}
        <img
          src={personal_info.image_cover || '/placeholder-profile.png'}
          alt="Profile"
          className="rounded-circle me-3"
          style={{ width: 80, height: 80, objectFit: 'cover' }}
        />
        <div>
          <h5 className="mb-0">{personal_info.full_name}</h5>
          <small className="text-muted">{role_name ?? 'Cashier'}</small>
        </div>
      </div>

      {/* Personal Info */}
      <div className="row mb-2">
        <div className="col-sm-4 text-muted">Email</div>
        <div className="col-sm-8 fw-semibold">{user.email}</div>
      </div>

      <div className="row mb-2">
        <div className="col-sm-4 text-muted">Contact No</div>
        <div className="col-sm-8 fw-semibold">{personal_info.contact_no}</div>
      </div>

      <div className="row mb-2">
        <div className="col-sm-4 text-muted">Birthdate</div>
        <div className="col-sm-8 fw-semibold">{personal_info.birth_date_format}</div>
      </div>

      <div className="row mb-2">
        <div className="col-sm-4 text-muted">Gender</div>
        <div className="col-sm-8 fw-semibold">{personal_info.gender === 'M' ? 'Male' : 'Female'}</div>
      </div>

      <div className="row mb-3">
        <div className="col-sm-4 text-muted">Address</div>
        <div className="col-sm-8 fw-semibold">{personal_info.address}</div>
      </div>

      {/* Modules */}
      <div className="row">
        <div className="col-sm-4 text-muted">Cashier</div>
        <div className="col-sm-8">
          {modules.length ? (
            <KTIcon iconName='check-circle' className='fs-2 text-success'/>
          ) : (
            <span className="text-muted">None</span>
          )}
        </div>
      </div>
    </>
  );
};

export { ViewUserDetailsModal };


