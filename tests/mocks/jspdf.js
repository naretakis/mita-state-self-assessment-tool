// Mock implementation of jsPDF for testing
const jsPDF = jest.fn().mockImplementation(() => ({
  setFontSize: jest.fn(),
  text: jest.fn(),
  setFont: jest.fn(),
  addPage: jest.fn(),
  save: jest.fn(),
  output: jest.fn(() => 'mock-pdf-output'),
  internal: {
    pageSize: {
      width: 210,
      height: 297,
    },
  },
}));

module.exports = jsPDF;
module.exports.default = jsPDF;
