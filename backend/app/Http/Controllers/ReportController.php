<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReportResource;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'judul_laporan'       => 'required|string|max:255',
            'kategori'            => 'nullable|string|max:100',
            'prioritas'           => ['nullable', Rule::in(['rendah', 'sedang', 'darurat'])],
            'fakultas'            => 'nullable|string|max:255',
            'lokasi_fasilitas'    => 'required|string|max:255',
            'deskripsi_kerusakan' => 'required|string',
            'foto_bukti'          => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        $report                      = new Report();
        $report->user_id             = $request->user()->id;
        $report->judul_laporan       = $request->judul_laporan;
        $report->kategori         = $request->kategori ?? 'lainnya';
        $report->prioritas        = $request->prioritas ?? 'sedang';
        $report->fakultas         = $request->fakultas;
        $report->lokasi_fasilitas = $request->lokasi_fasilitas;
        $report->deskripsi_kerusakan = $request->deskripsi_kerusakan;
        $report->status              = 'pending';

        if ($request->hasFile('foto_bukti')) {
            $path            = $request->file('foto_bukti')->store('reports', 'public');
            $report->foto_bukti = $path;
        }

        $report->save();

        return response()->json([
            'success' => true,
            'message' => 'Report created successfully',
            'data'    => new ReportResource($report->load('user')),
        ], 201);
    }

    public function index(Request $request)
    {
        $query = Report::query()->with('user');

        // Search by judul atau lokasi atau fakultas atau kategori
        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->where('judul_laporan', 'like', "%{$search}%")
                  ->orWhere('lokasi_fasilitas', 'like', "%{$search}%")
                  ->orWhere('fakultas', 'like', "%{$search}%")
                  ->orWhere('kategori', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            if (!$request->boolean('include_selesai') && $request->input('include_selesai') !== 'true') {
                $query->where('status', '!=', 'selesai');
            }
        }

        // Filter by kategori
        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        // Filter by fakultas
        if ($request->filled('fakultas')) {
            $query->where('fakultas', $request->fakultas);
        }

        // Filter by my reports
        if ($request->filled('my_reports') && $request->my_reports) {
            $query->where('user_id', $request->user()->id);
        }

        // Sort
        $sort = $request->input('sort', 'terbaru');
        switch ($sort) {
            case 'upvote':
                $query->withCount('votes')->orderByDesc('votes_count');
                break;
            case 'urgensi':
                $query->orderByRaw("FIELD(prioritas, 'darurat', 'sedang', 'rendah')");
                break;
            default: // terbaru
                $query->orderByDesc('created_at');
        }

        $perPage = $request->input('per_page', 15);
        $reports = $query->withoutTrashed()
                         ->paginate($perPage);

        return response()->json([
            'success'    => true,
            'message'    => 'Reports retrieved',
            'data'       => ReportResource::collection($reports),
            'pagination' => [
                'total'        => $reports->total(),
                'per_page'     => $reports->perPage(),
                'current_page' => $reports->currentPage(),
                'last_page'    => $reports->lastPage(),
                'from'         => $reports->firstItem(),
                'to'           => $reports->lastItem(),
            ],
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status'        => ['required', Rule::in(['pending', 'diproses', 'selesai'])],
            'catatan_admin' => 'nullable|string',
        ]);

        $report = Report::findOrFail($id);

        $updateData = ['status' => $request->status];
        if ($request->filled('catatan_admin')) {
            $updateData['catatan_admin'] = $request->catatan_admin;
        }

        $report->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Report status updated',
            'data'    => new ReportResource($report->load('user')),
        ]);
    }

    public function show(Request $request, $id)
    {
        $report = Report::with(['user', 'comments' => fn ($q) => $q->withoutTrashed()->with('user')])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Report retrieved',
            'data'    => new ReportResource($report),
        ]);
    }

    public function stats(Request $request)
    {
        // withTrashed agar laporan yg diarsipkan tetap dihitung
        $total    = Report::withTrashed()->count();
        $pending  = Report::withoutTrashed()->where('status', 'pending')->count();
        $diproses = Report::withoutTrashed()->where('status', 'diproses')->count();
        $selesai  = Report::withTrashed()->where('status', 'selesai')->count();
        $archived = Report::onlyTrashed()->count();

        return response()->json([
            'success' => true,
            'message' => 'Stats retrieved',
            'data'    => [
                'total'    => $total,
                'pending'  => $pending,
                'diproses' => $diproses,
                'selesai'  => $selesai,
                'archived' => $archived,
            ],
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $report = Report::findOrFail($id);

        if ($report->status !== 'selesai') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya laporan berstatus selesai yang dapat diarsipkan.',
            ], 422);
        }

        $report->delete(); // soft-delete — data tetap ada di DB

        return response()->json([
            'success' => true,
            'message' => 'Laporan berhasil diarsipkan.',
        ]);
    }
}
