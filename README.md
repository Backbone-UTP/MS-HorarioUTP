antes de ejecutar cualquier comando del package.json debes ejecutar los comandos:

$env:NODE_EXTRA_CA_CERTS = '.\\certificados\\intermediate.pem'

y luego ejecuar cualquier comando dentro de package.json.

para desabilitar el molesto warning del fecth puedes utilizar este comando

$env:NODE_NO_WARNINGS=1

otras cosas que debes saber antesd e empezar con mi codigo:

1. yo aveces referencio la misma cosa con diferentes nombres, no en el codigo, sino en los magic
string que me dejo y tengo que arreglar en un futuro aca algunas que me acuerdo ahora mismo

PHPSESSID = cookieId
UTP = universidad tecnologica de Pereira

2. los test estan hechos, no en la carpeta test sino en la carpeta del mismo archivo

3. si no quieres utilizar los comando de arriba, se debe instalar cross-env