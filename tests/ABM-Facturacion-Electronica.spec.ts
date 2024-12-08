import { test, expect } from '@playwright/test';



test('test', async ({ page }) => {


  // Establecer un timeout más largo para esta prueba
  test.setTimeout(180000); // 2 mins
  await page.goto('http://localhost/ssgWebBZ/Login/ssgBZ010%2FFactura%2FVentas');


  await page.getByPlaceholder('Usuario').fill('administrador');
  await page.getByPlaceholder('Usuario').press('Tab');
  await page.getByPlaceholder('Contraseña').fill('rjs2528');
  await page.getByPlaceholder('Contraseña').press('Enter');

  // Verificar que la URL cambie
  await expect(page).toHaveURL('http://localhost/ssgWebBZ/ssgBZ010/Factura/Ventas');
  console.log('Inicio de sesión exitoso');
  
  
  // actualizar pantalla
  await page.locator('button[title="Actualizar"]').last().click();

  // Esperar que el contenido se actualice
  await page.waitForTimeout(4000); // Espera 4 segundos para que la página se actualice


async function obtenerNumeroComprobantes(page) {
  // Selecciona el elemento con el XPath
  const smallElement = await page.locator('xpath=//div[10]/span/small');
  // Obtener el texto del elemento
  const contenido = await smallElement.textContent();
  // Buscar el número en el texto
  const match = contenido.trim().match(/\d+/);
  // Convertir el número a entero y devolverlo
  const numero = match ? parseInt(match[0], 10) : NaN;
  return numero;
}

const numeroInicial = await obtenerNumeroComprobantes(page);
console.log('Número actual de comprobantes PI:', numeroInicial); // Imprimir para verificar


  await page.getByRole('button', { name: '+' }).click();
  await page.locator('form').filter({ hasText: 'Insertar facturación (ventas' }).getByLabel('Comprobante:').selectOption('FAVEAEL'); //selecionamos la fact electr

  await page.waitForTimeout(2000); // Espera 2 segundos para que la página se actualice  


  await page.getByRole('textbox', { name: 'Cliente:' }).fill('carrar');
  await page.getByRole('textbox', { name: 'Cliente:' }).press('Enter');
  await page.getByRole('tab', { name: 'Cuerpo' }).click();
  await page.locator('nav').filter({ hasText: 'Artículos Afectar' }).getByRole('button').first().click();
  await page.getByPlaceholder('Ingrese un nombre de artículo').fill('00318');
  await page.getByPlaceholder('Ingrese un nombre de artículo').press('Enter');
  await page.getByRole('textbox', { name: 'Cantidad:' }).fill('11,00');
  await page.getByRole('textbox', { name: 'Cantidad:' }).press('Enter');


  const grabar = await page.getByRole('button', { name: '' }).first()
  await page.waitForTimeout(2000); // Espera 2 segundos sino arroja error porque no encuentra al elemento
  await grabar.click()


  //se graba como PENDIENTE DE IMPRIMIR
  // Esperar que el contenido se actualice
  await page.waitForTimeout(4000); // Espera 4 segundos para que la página se actualice

  // Esperar a que el elemento <small> esté disponible
  await page.waitForSelector('xpath=//div[10]/span/small', { timeout: 60000 });


const numeroFinal = await obtenerNumeroComprobantes(page);
console.log('Número actual de comprobantes PI con la factura recien registrada:', numeroFinal); // Imprimir para verificar


  // Comprobar si el número de items se incremento en 1 significando que se grabo en Pendiente de imprimir correctamente
  
  expect(numeroFinal).toBe(numeroInicial + 1);

  //modificamos la factura electrónica a Finalizada
  //clickeamos boton de modificar
 
  const modi = await page.getByRole('button', { name: '' })
  await modi.click()
  //await page.getByLabel('Estado sugerido').selectOption('FI');
  await page.getByRole('combobox', { name: 'Estado sugerido:' }).selectOption('FI');

  //click a boton imprimir
  await page.locator('button.btn.btn-secondary[data-toggle="tooltip"][data-placement="top"][title="Imprimir"]').last().click()

  //tildar Imprimir comprobante y cerrar
  await page.getByRole('checkbox', { name: 'Imprimir comprobante' }).click()
  await page.getByRole('button', { name: 'Cerrar' }).click()

  
  //grabar

  await page.waitForTimeout(2000); // Espera 1 segundos para que la página se actualice
  await grabar.click()

  // Esperar que el contenido se actualice
  await page.waitForTimeout(6000);
  await page.locator('css=#myModal > div > div > form > div > div.modal-footer > button').click() //validacion de sistema de ERROR DE REPOR T GUID, se da ok ""
  
  //despues de finalizar, filtrar por finalizados y verificar la factura
  const botonfiltro = await page.locator('button[title="Filtros"]').nth(1);
  await botonfiltro.click();
  await page.getByLabel('Mostrar comprobantes en').selectOption('FI');
  await page.getByRole('button', { name: 'Filtrar' }).click();



  await page.waitForTimeout(4000); // Espera 4 segundos para que la página se actualice

  // Esperar a que el elemento <small> esté disponible
  await page.waitForSelector('xpath=//div[10]/span/small', { timeout: 60000 });


  const numeroFinalFI = await obtenerNumeroComprobantes(page);
  console.log('Número actual de comprobantes FI con la factura recien finalizada::', numeroFinalFI); // Imprimir para verificar

  // posiciona sobre la factura, luego ingresamos y verificamos que tenga estado "Finalizado" y visible el recuadro del certificado

  //localizamos la factura electronica recien hecha
  const factws = await page.getByRole('cell', { name: '4. Factura "A" (WS)' }).last();
  await factws.click()
  await modi.click()  
  
  const spanel = await page.locator('div.col-auto.ms-auto.align-self-center > span');
  await spanel.waitFor() //esperamos a que el span este visible
  const textspan = await spanel.textContent();
  const formateado = textspan?.trim()

  //verificamos que está finalizada correctamente
  expect(formateado).toBe('Finalizado');

  //Verificamos que tiene el "Certificado electrónico"

  // Localiza el span con el texto "Comprobante electrónico"
  const span = await page.locator('span', { hasText: 'Comprobante electrónico' });

  // Sube al div contenedor
  const divContenedor = await span.locator('xpath=ancestor::div[@class="col border small"]');
  
  // Verifica que el div contenedor sea visible
  await expect(divContenedor).toBeVisible();

  const locator = page.locator('xpath=//div[4]/input');
  const numerocomprob = await locator.inputValue();
  const nrocomprobante = parseInt(numerocomprob, 10);
  console.log('El nro de comprobante registrado de la factura electrónica es',nrocomprobante);

  //ANULACIÓN DE LA FACTURA Y GENERACIÓN DE Anulador Credito "A" (WS)
  const anu = page.locator('button.btn.btn-danger.text-white[data-toggle="tooltip"][data-placement="top"][title="Anular"]');
  await anu.click()

  //confirmar anulacion
  await page.locator('css=#myModal > div > div > form > div > div.modal-footer > button.btn.btn-primary').click()
  // queda generado el anulador credito y al final esta la factura, la cual tiene estado Finalizado - (Anulado)
  // ahora se debe entrar a la factura y verificar que tiene el estado Finalizado - (Anulado)

  //verificamos que se incremento en 1 la lista de comprobantes finalizados indicando que se genero el comprobante anulador

  // Esperar a que el elemento <small> esté disponible
  await page.waitForSelector('xpath=//div[10]/span/small', { timeout: 60000 });

const numeroFinalconanu = await obtenerNumeroComprobantes(page);
console.log('Número actual de comprobantes FI con el comprobante anulador registrado:', numeroFinalconanu); // Imprimir para verificar

  expect(numeroFinalconanu).toBe(numeroFinalFI + 1);

  
  //localizamos el anulador crédito recien hecho y verificamos que tiene el estado Finalizado - (Anulador)
  const contra = await page.getByRole('cell', { name: 'Anulador Credito "A" (WS)' }).last();
  await contra.click()


  await modi.click()  
  
  const spananulador = await page.locator('div.col-auto.ms-auto.align-self-center > span');
  await spananulador.waitFor() //esperamos a que el span este visible
  const textspananulador = await spananulador.textContent();
  const formateadoanulador = textspananulador?.trim()

  console.log('El estado del comprobante anulador es', formateadoanulador)
  //verificamos que está finalizada correctamente con estado Finalizado  - (Anulador)
  expect(formateadoanulador).toBe('Finalizado  - (Anulador)');


  //ahora vamos a ir a la ficha "Comprobantes"

  const fichacomprob = await page.getByRole('tab', { name: 'Comprobantes (Relac.)'})
  await fichacomprob.click()


  const facturaafect = await page.getByRole('cell', { name: '4. Factura "A" (WS)' })
  await facturaafect.click()

  //presionar enter para poder acceder y guardar numero de la factura asociada
  await facturaafect.press('Enter')

  await page.waitForTimeout(2000);

  // Localizar el input usando tanto la clase como el placeholder y obtener su valor
  const nroinputfact = page.locator('input.form-control.form-control-sm[placeholder="Ingrese un número de comprobante para buscar..."]');
  const valorInput = await nroinputfact.inputValue();
  
  // Extraer el número después del guion y eliminar ceros a la izquierda
  const numero = parseInt(valorInput.split('-').pop(), 10); // Convierte a número, eliminando ceros a la izquierda
  console.log('Número de la factura afectada en el anulador:', numero);

  //verificamos que el numero de la factura afectada en el comprob. anulador es igual al nro de la factura electronica que guardamos anteriormente cuando la registramos
  expect(numero).toBe(nrocomprobante);



});


