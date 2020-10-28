require('dotenv').config();
const bacenServices = require('./services/bacen.services');
const builder = require('xmlbuilder');
const convert = require('xml-js');
const fs = require('fs');
const sha256File = require('sha256-file');
const moment = require('moment');
const admZip = require('adm-zip');

(async () => {
    const dataAtual = moment().format('YYYYMMDD');
    const dir_default = process.env.DIR_DEFAULT;
    const xml = generateXMLArquivoEnvio(null);
    const fileName = 'AACG001_360305_' + dataAtual + '_0003.xml';
    const fileZip = dir_default + fileName.replace('.xml', '.zip');
    fs.writeFileSync(dir_default + fileName, xml);
    /*let zip = new admZip();
    zip.addLocalFile(dir_default + fileName);
    const willSendthis = zip.toBuffer();
    zip.writeZip(fileZip);
    */
    const fileStats = fs.statSync(dir_default + fileName);
    const fileSize = fileStats["size"];
    const hash = sha256File(dir_default + fileName);

    const xmlProtocolo = generateXMLArquivoProtocolo('AACG001', hash, fileSize, dir_default + fileName);
    console.log('Requisitando protocolo BACEN');
    let xmlResultado = await bacenServices.sendRequestProtocol(xmlProtocolo);
    const result = convert.xml2json(xmlResultado, { compact: true, spaces: 4 });
    obj = JSON.parse(result);
    console.log('Enviando arquivo BACEN');
    const xmlEnvioProtocolo = bacenServices.sendFile(obj.Resultado.Protocolo["_text"], dir_default + fileName);
    console.log(xmlEnvioProtocolo);

})();

function generateXMLArquivoEnvio(clientes) {
    const dataAtual = moment().format('YYYY-MM-DD');
    var root = builder.create('documento', { encoding: 'UTF-8' }).att('codigoDocumento', 'ACG1').att('cnpjConsulente', '00360305').att('data', dataAtual);
    var cliente1 = root.ele('cliente');
    cliente1.att('cnpjCliente', '07771581');
    cliente1.att('consentimentoExpresso', 'S');
    var cliente2 = root.ele('cliente');
    cliente2.att('cnpjCliente', '07068269');
    cliente2.att('consentimentoExpresso', 'S');
    var cliente3 = root.ele('cliente');
    cliente3.att('cnpjCliente', '28750383');
    cliente3.att('consentimentoExpresso', 'S');
    var cliente4 = root.ele('cliente');
    cliente4.att('cnpjCliente', '10657527');
    cliente4.att('consentimentoExpresso', 'S');
    var cliente5 = root.ele('cliente');
    cliente5.att('cnpjCliente', '16572028');
    cliente5.att('consentimentoExpresso', 'S');
    var cliente6 = root.ele('cliente');
    cliente6.att('cnpjCliente', '86652211');
    cliente6.att('consentimentoExpresso', 'S');
    var cliente7 = root.ele('cliente');
    cliente7.att('cnpjCliente', '05111495');
    cliente7.att('consentimentoExpresso', 'S');
    var cliente8 = root.ele('cliente');
    cliente8.att('cnpjCliente', '09006459');
    cliente8.att('consentimentoExpresso', 'S');
    var cliente9 = root.ele('cliente');
    cliente9.att('cnpjCliente', '17044951');
    cliente9.att('consentimentoExpresso', 'S');
    var cliente10 = root.ele('cliente');
    cliente10.att('cnpjCliente', '10734451');
    cliente10.att('consentimentoExpresso', 'S');
    var cliente11 = root.ele('cliente');
    cliente11.att('cnpjCliente', '30378654');
    cliente11.att('consentimentoExpresso', 'S');
    var cliente12 = root.ele('cliente');
    cliente12.att('cnpjCliente', '13438904');
    cliente12.att('consentimentoExpresso', 'S');
    var cliente13 = root.ele('cliente');
    cliente13.att('cnpjCliente', '00497695');
    cliente13.att('consentimentoExpresso', 'S');
    var cliente14 = root.ele('cliente');
    cliente14.att('cnpjCliente', '07836522');
    cliente14.att('consentimentoExpresso', 'S');
    var xml = root.end({ pretty: true });
    return xml;
}

function generateXMLArquivoProtocolo(tpArquivo, hash, tamanhoArquivo, nome) {
    var root = builder.create('Parametros', { encoding: 'UTF-8', standalone: 'yes' });
    root.ele('IdentificadorDocumento', tpArquivo);
    root.ele('Hash', hash);
    root.ele('Tamanho', tamanhoArquivo);
    root.ele('NomeArquivo', nome);
    var xml = root.end({ pretty: true });
    return xml;
}
