const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions
} = require("@azure/storage-blob");

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_CONTAINER_NAME;

// Azure credentials
const sharedKeyCredential =
  new StorageSharedKeyCredential(accountName, accountKey);

// Blob service
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

// Container reference
const containerClient =
  blobServiceClient.getContainerClient(containerName);

// UPLOAD FILE
exports.uploadFile = async (req, res) => {
  try {
    const folder = req.params.folder;
    const file = req.file;

    const blobName = `${folder}/${file.originalname}`;
    const blockBlobClient =
      containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer);

    res.json({
      message: "File uploaded successfully",
      filePath: blobName
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GENERATE SAS URL
exports.generateSASUrl = async (req, res) => {
  try {
    const { folder, filename } = req.params;

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: `${folder}/${filename}`,
        permissions: BlobSASPermissions.parse("r"),
        expiresOn: new Date(Date.now() + 60 * 60 * 1000)
      },
      sharedKeyCredential
    ).toString();

    const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${folder}/${filename}?${sasToken}`;

    res.json({ downloadUrl: sasUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
