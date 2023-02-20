# Generate access/refresh public/private keys for RS256 JWT Strategy 

```bash
mkdir access-token
mkdir refresh-token

# Do not add any passphrase
ssh-keygen -t rsa -b 4096 -m PEM -f access-token/rs256.key
ssh-keygen -t rsa -b 4096 -m PEM -f refresh-token/rs256.key

openssl rsa -in access-token/rs256.key -pubout -outform PEM -out access-token/rs256.key.pub
openssl rsa -in refresh-token/rs256.key -pubout -outform PEM -out refresh-token/rs256.key.pub
```
