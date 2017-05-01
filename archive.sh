#! /bin/sh
# Creation de l'archive


cd app

zip -r ../sportstimer-3.0.zip * -x *.*~
cp ../sportstimer-3.0.zip ~/public_html/install/package.zip

exit 0
