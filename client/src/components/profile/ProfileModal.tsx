import Modal from "../shared/modal";
import {useAuth} from "../../context/AuthContext";

type ProfileModalProps ={
  isOpen: boolean;
  onClose: () =>void;
};

function ProfileModal({ isOpen, onClose }: ProfileModalProps){
  const { user, profile, profileLoading } = useAuth();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Min profil'>

      {profileLoading ?(<p>Laddar profil...</p>):
    profile ?(

        <div className='profile-info'>

          <p><strong>Förnamn:</strong> {profile.first_name ?? '-'}</p>

          <p><strong>Efternamn:</strong> {profile.last_name ?? '-'}</p>

          <p><strong>E-post:</strong> {user?.email ?? '-'}</p>

          <p><strong>Prenumeration:</strong>{''} {profile.subscription_level.level_name}</p>
        </div>
      ):(
        <p>Profilen kunde inte hämtas</p>
      )}

      {/*TODO: Visa kvitton här nedan */}
      <section className='profile-receipts'>
        <h3>Kvitton</h3>
        <p>Inga kvitton att visa ännu</p>
      </section>
    </Modal>
  );
}

export default ProfileModal;