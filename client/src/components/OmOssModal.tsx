import Modal from "./shared/modal";

type OmOssModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function OmOssModal({ isOpen, onClose }: OmOssModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Om oss">
      <p>
        KarriärKoll är byggt av tre studenter på Fullstackutvecklarprogrammet
        som ett grupprojekt i kursen Systemutveckling: Nikolaos Kiosses,
        Sheema Kamal och Harald Wallin.
      </p>
      <p className="muted">
        Vi ville göra det enklare att hålla koll på jobbansökningar,
        intervjuer och mål på ett och samma ställe — utan att behöva
        blanda kalkylark och anteckningar.
      </p>
    </Modal>
  );
}