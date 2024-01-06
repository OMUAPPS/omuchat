// Copyright 2019-2021 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT
// https://github.com/tauri-apps/tauri-plugin-localhost

use std::collections::HashMap;

use http::Uri;
use tauri::{
    plugin::{Builder as PluginBuilder, TauriPlugin},
    Runtime,
};
use tiny_http::{Header, Response as HttpResponse, Server};

pub struct Response {
    headers: HashMap<String, String>,
}

impl Response {
    pub fn add_header<H: Into<String>, V: Into<String>>(&mut self, header: H, value: V) {
        self.headers.insert(header.into(), value.into());
    }
}

pub struct Builder {
    port: u16,
}

impl Builder {
    pub fn new(port: u16) -> Self {
        Self { port }
    }

    pub fn build<R: Runtime>(self) -> TauriPlugin<R> {
        let port = self.port;

        PluginBuilder::new("server")
            .setup(move |app| {
                let asset_resolver = app.asset_resolver();
                std::thread::spawn(move || {
                    let server =
                        Server::http(&format!("0.0.0.0:{port}")).expect("Unable to spawn server");
                    for req in server.incoming_requests() {
                        let path = req
                            .url()
                            .parse::<Uri>()
                            .map(|uri| uri.path().into())
                            .unwrap_or_else(|_| req.url().into());

                        #[allow(unused_mut)]
                        if let Some(mut asset) = asset_resolver.get(path) {
                            let mut response = Response {
                                headers: Default::default(),
                            };

                            response.add_header("Content-Type", asset.mime_type);
                            if let Some(csp) = asset.csp_header {
                                response
                                    .headers
                                    .insert("Content-Security-Policy".into(), csp);
                            }

                            #[cfg(target_os = "linux")]
                            if let Some(response_csp) =
                                response.headers.get("Content-Security-Policy")
                            {
                                let html = String::from_utf8_lossy(&asset.bytes);
                                let body =
                                    html.replacen(tauri::utils::html::CSP_TOKEN, response_csp, 1);
                                asset.bytes = body.as_bytes().to_vec();
                            }

                            let mut resp = HttpResponse::from_data(asset.bytes);
                            for (header, value) in response.headers {
                                if let Ok(h) = Header::from_bytes(header.as_bytes(), value) {
                                    resp.add_header(h);
                                }
                            }
                            req.respond(resp).expect("unable to setup response");
                        }
                    }
                });
                Ok(())
            })
            .build()
    }
}
