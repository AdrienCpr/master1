// import { useState } from 'react';
// import Modal from '@/Components/Modal';
// import {Piece} from "@/types";
// interface CreatePieceModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onCreatePiece: (newPiece: Piece) => void;
// }
//
// const CreatePieceModal: React.FC<CreatePieceModalProps> = ({ isOpen, onClose, onCreatePiece }) => {
//     const [newPiece, setNewPiece] = useState<Piece>({
//         id: 0,
//         ref: '',
//         name: '',
//         type: '',
//         price: 0,
//     });
//
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setNewPiece(prevState => ({
//             ...prevState,
//             [name]: value,
//         }));
//     };
//
//     const handleCreate = () => {
//         onCreatePiece(newPiece);
//         onClose();
//     };
//
//     // @ts-ignore
//     return (
//         <Modal isOpen={isOpen} onClose={onClose}>
//             <div className="p-6">
//                 <h2 className="text-lg font-semibold mb-4">Créer une nouvelle pièce</h2>
//                 <div className="mb-4">
//                     <label className="block text-sm font-medium mb-2">Référence</label>
//                     <input
//                         type="text"
//                         name="ref"
//                         value={newPiece.ref}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 rounded-md px-3 py-2 w-full"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-sm font-medium mb-2">Nom</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={newPiece.name}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 rounded-md px-3 py-2 w-full"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-sm font-medium mb-2">Type</label>
//                     <select
//                         name="type"
//                         value={newPiece.type}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 rounded-md px-3 py-2 w-full"
//                     >
//                         <option value="">Sélectionner le type</option>
//                         <option value="fabriqué">Fabriqué</option>
//                         <option value="matières premières">Matières premières</option>
//                         <option value="acheté">Acheté</option>
//                     </select>
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-sm font-medium mb-2">Prix</label>
//                     <input
//                         type="number"
//                         name="price"
//                         value={newPiece.price}
//                         onChange={handleInputChange}
//                         className="border border-gray-300 rounded-md px-3 py-2 w-full"
//                     />
//                 </div>
//                 <div className="flex justify-end">
//                     <button className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2" onClick={handleCreate}>
//                         Créer
//                     </button>
//                     <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100" onClick={onClose}>
//                         Annuler
//                     </button>
//                 </div>
//             </div>
//         </Modal>
//     );
// };
//
// export default CreatePieceModal;
