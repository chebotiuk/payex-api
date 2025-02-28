const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "id": 1,
  "jsonrpc": "2.0",
  "method": "blob.Submit",
  "params": [
    [
      {
        "namespace": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdE=",
        "data": "z8QyNztvogN7NYU27gI+nJgg1vMJtkK3vbduSDz7/8mhmos37I7duH51kkgouxrsdhdOBJ1431OmipNfVedbtwe6zQ06EbJBl/jk4QwwU3S29YBTUZcUfTzXpEJIuMrYzU6YPxN8Zce/KNdsEIy4zxdfxekXpvsgZMBhf83iYgfHvsFAoJmmCp/ORAUoAFf7tJ7cF8RZyA20ftqRa1uhAmktxIb58abpGTG+TNgq3mjyvswECVykJYqGjqNtInyIx2EQOnVp2q69YHkegdoBvoOKzEFigQTdrL2TZBex4MhkrYt7Zf0DQyNMRkCPL/zKYE3bhvXNWMThWCmhD5TOApzirORXKOTB0nxhjDF/aFYkrS+IKBw1KfJ5isldWvmasJBWwRgDuli6Cty67vMMk7fUUTUf0St6rvQeftSoEVlC1xEw46+h5kIXaWiM0g/EzGIAdZHycUFWCSdnt3p7BS5ttEpSf1d6ZbVYYL2y0XguH41k54JqufEMAw9ukmaF0IbN9Jk6fNefV1dsWTdCP6Mz6e+RTCd9DQGqb2VrsvMzx5uVidLD8ND79pvXgL1VzyhJaMTcjSfZK15jOxLwGh1arZc2gyTNiq2pu6wNz0tdJp+fFU+peG8rHN8=",
        "share_version": 0,
        "commitment": "aHlbp+J9yub6hw/uhK6dP8hBLR2mFy78XNRRdLf2794=",
        "index": -1
      }
    ],
    {
      "gas_price": 0.002,
      "is_gas_price_set": true,
      "gas": 142225,
      "key_name": "YOUR_CELESTIA_KEYS",
      "signer_address": "celestia1823th6r2mveml07qcjf2jd2ua3vsy0ppvnljyn",
      "fee_granter_address": "celestia1823th6r2mveml07qcjf2jd2ua3vsy0ppvnljyn"
    }
  ]
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://docs-demo.celestia-mainnet.quiknode.pro/", requestOptions) // Use https://celestia-mocha-rpc.publicnode.com:443
  .then((response) => response.text())                                    // Docs https://www.quicknode.com/docs/celestia/blob.submit
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
