<?php

namespace App\Http\Controllers;

use App\Models\MapPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MapPointController extends Controller
{
    /**
     * Получить все точки
     */
    public function index()
    {
        return MapPoint::with('user:id,username')->get();
    }

    /**
     * Получить одну точку по ID
     */
    public function show($id)
    {
        $point = MapPoint::with('user:id,username')->find($id);

        if (!$point) {
            return response()->json(['message' => 'Точка не найдена'], 404);
        }

        return $point;
    }

    /**
     * Создать новую точку (только авторизованный пользователь)
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        $point = MapPoint::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'lat' => $request->lat,
            'lng' => $request->lng,
        ]);

        return response()->json($point, 201);
    }

    /**
     * Обновить точку (только если принадлежит текущему пользователю)
     */
    public function update(Request $request, $id)
    {
        $point = MapPoint::find($id);

        if (!$point) {
            return response()->json(['message' => 'Точка не найдена'], 404);
        }

        if ($point->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Нет доступа'], 403);
        }

        $point->update($request->only(['title', 'description', 'lat', 'lng']));

        return response()->json($point);
    }

    /**
     * Удалить точку (только если принадлежит текущему пользователю)
     */
    public function destroy(Request $request, $id)
    {
        $point = MapPoint::find($id);

        if (!$point) {
            return response()->json(['message' => 'Точка не найдена'], 404);
        }

        if ($point->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Нет доступа'], 403);
        }

        $point->delete();

        return response()->json(['message' => 'Удалено успешно']);
    }
}
