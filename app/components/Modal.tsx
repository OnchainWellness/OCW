interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
}

export const Modal = ({ isOpen, onClose, className, ...rest }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div 
        className={"fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center " + className}
        onClick={(e)=> {
        if (e.target !== e.currentTarget)
            return
        onClose();
        }}
        {...rest}
    >
      <div className="bg-background rounded-lg shadow-md">
        {rest.children}
      </div>
    </div>
  );
};