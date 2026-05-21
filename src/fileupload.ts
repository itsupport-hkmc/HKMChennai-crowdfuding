// import multer, { FileFilterCallback } from 'multer';
// import path from 'path';
// import { Request } from 'express';

// // Define the file filter type
// interface File extends Express.Multer.File {
//   mimetype: string;
// }

// const storage = multer.diskStorage({
//   destination: (req: Request, file: File, cb: Function) => {
//     cb(null, path.join(__dirname, '../Uploads'));
//   },
//   filename: (req: Request, file: File, cb: Function) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const fileFilter: multer.Options['fileFilter'] = (req: Request, file: File, cb: FileFilterCallback) => {
//   console.log("multer", file);
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(new Error('Unsupported file type'), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 1024 * 1024 * 5 // 5MB
//   }
// }).array('img[]');

// export default upload;
